import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyJobs } from "../../hooks/useMyJobs";
import { deleteJob, updateJob } from "../../services/jobService";
import { formatDate, formatSalary } from "../../utils/formatters";
import StatusBadge from "../../components/StatusBadge";
import ConfirmationModal from "../../components/ConfirmationModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

export default function EmployerJobs() {
  const { jobs, setJobs, loading, error, reload } = useMyJobs();
  const [statusFilter, setStatusFilter] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const visible = statusFilter ? jobs.filter((j) => j.status === statusFilter) : jobs;

  const toggleStatus = async (job) => {
    setActionError("");
    setTogglingId(job._id);
    try {
      const res = await updateJob(job._id, { status: job.status === "Open" ? "Closed" : "Open" });
      setJobs((list) => list.map((j) => (j._id === job._id ? res.data.job : j)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    await deleteJob(toDelete._id); // if this throws, ConfirmationModal shows the error
    setJobs((list) => list.filter((j) => j._id !== toDelete._id));
    setToDelete(null);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl">My jobs</h1>
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="job-status" className="mr-2 text-sm">Status</label>
            <select id="job-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-stone-300 bg-white px-3 py-2 text-sm">
              <option value="">All</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <Link to="/dashboard/employer/post-job" className="bg-ink px-5 py-2 text-sm text-white hover:bg-stone-700">
            Post a job
          </Link>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      <div className="mt-4"><ErrorMessage message={error} onRetry={reload} /></div>
      {actionError && <p className="mt-4 bg-red-50 p-3 text-sm text-red-700" role="alert">{actionError}</p>}

      {!loading && !error && (
        <>
          <p className="mt-4 text-sm text-stone-600">{visible.length} {visible.length === 1 ? "job" : "jobs"}</p>
          {visible.length === 0 ? (
            <div className="mt-4 border border-line bg-white p-8 text-center">
              <p className="font-medium">{jobs.length === 0 ? "You have not posted any jobs yet" : "No jobs with this status"}</p>
              {jobs.length === 0 && (
                <Link to="/dashboard/employer/post-job"
                  className="mt-4 inline-block bg-ink px-5 py-2 text-sm text-white hover:bg-stone-700">
                  Post your first job
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {visible.map((job) => (
                <article key={job._id} className="border border-line bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg">
                        <Link to={`/jobs/${job._id}`} className="hover:text-accent">{job.title}</Link>
                      </h2>
                      <p className="mt-1 text-sm text-stone-600">
                        {job.location} · {job.jobType} · {formatSalary(job.salaryRange)}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">Posted {formatDate(job.createdAt)}</p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-sm">
                    <Link to={`/dashboard/employer/jobs/${job._id}/applicants`}
                      className="bg-ink px-4 py-1.5 text-white hover:bg-stone-700">
                      Applicants
                    </Link>
                    <Link to={`/dashboard/employer/jobs/${job._id}/edit`}
                      className="border border-line px-4 py-1.5 hover:border-ink">
                      Edit
                    </Link>
                    <button type="button" disabled={togglingId === job._id} onClick={() => toggleStatus(job)}
                      className="border border-line px-4 py-1.5 hover:border-ink disabled:opacity-50">
                      {job.status === "Open" ? "Close job" : "Reopen job"}
                    </button>
                    <button type="button" onClick={() => setToDelete(job)}
                      className="px-3 py-1.5 text-red-700 underline underline-offset-4 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {toDelete && (
        <ConfirmationModal
          title="Delete this job?"
          message={`"${toDelete.title}" and ALL applications it has received will be permanently deleted. To stop new applications but keep the history, close the job instead.`}
          confirmLabel="Delete job"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
