import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyApplications } from "../../hooks/useMyApplications";
import ApplicationCard from "../../components/ApplicationCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

export default function SeekerApplications() {
  const { applications, loading, error, reload } = useMyApplications();
  const [statusFilter, setStatusFilter] = useState("");

  const visible = statusFilter ? applications.filter((a) => a.status === statusFilter) : applications;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl">My applications</h1>
        <div>
          <label htmlFor="status-filter" className="mr-2 text-sm">Status</label>
          <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-stone-300 bg-white px-3 py-2 text-sm">
            <option value="">All</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      <div className="mt-4"><ErrorMessage message={error} onRetry={reload} /></div>

      {!loading && !error && (
        <>
          <p className="mt-4 text-sm text-stone-600">
            {visible.length} {visible.length === 1 ? "application" : "applications"}
          </p>
          {visible.length === 0 ? (
            <div className="mt-4 border border-line bg-white p-8 text-center">
              <p className="font-medium">
                {applications.length === 0 ? "You have not applied to any jobs yet" : "No applications with this status"}
              </p>
              {applications.length === 0 && (
                <Link to="/jobs" className="mt-4 inline-block bg-ink px-5 py-2 text-sm text-white hover:bg-stone-700">
                  Browse jobs
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {visible.map((a) => <ApplicationCard key={a._id} application={a} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
