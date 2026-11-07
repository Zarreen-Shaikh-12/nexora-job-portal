import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobs, deleteJob, updateJob } from "../../services/jobService";
import { formatDate } from "../../utils/formatters";
import StatusBadge from "../../components/StatusBadge";
import ConfirmationModal from "../../components/ConfirmationModal";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

const PAGE_SIZE = 10;

export default function AdminJobs() {
  const [statusFilter, setStatusFilter] = useState("all"); // all | Open | Closed
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const [togglingId, setTogglingId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    // The public endpoint with status=all lists open AND closed jobs
    getJobs({ status: statusFilter, search: search || undefined, page, limit: PAGE_SIZE, sort: "newest" })
      .then((res) => {
        if (!active) return;
        if (res.data.jobs.length === 0 && page > 1) {
          setPage(page - 1);
          return;
        }
        setJobs(res.data.jobs);
        setPagination(res.data.pagination);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [statusFilter, search, page, attempt]);

  const submitSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const toggleStatus = async (job) => {
    setActionError("");
    setTogglingId(job._id);
    try {
      const res = await updateJob(job._id, { status: job.status === "Open" ? "Closed" : "Open" });
      // Merge ONLY the status: the PUT response is not populated, so the company name would be lost
      setJobs((list) => list.map((j) => (j._id === job._id ? { ...j, status: res.data.job.status } : j)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    await deleteJob(toDelete._id);
    setToDelete(null);
    setAttempt((a) => a + 1);
  };

  const th = "px-4 py-3 font-medium";

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl">Job postings</h1>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <form onSubmit={submitSearch} role="search" className="flex gap-2">
          <label htmlFor="job-search" className="sr-only">Search jobs by title</label>
          <input id="job-search" type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Job title" className="w-56 border border-stone-300 bg-white px-3 py-2 text-sm" />
          <button type="submit" className="bg-ink px-4 py-2 text-sm text-white hover:bg-stone-700">Search</button>
          {search && (
            <button type="button" onClick={clearSearch} className="px-2 text-sm underline underline-offset-4 hover:text-accent">
              Clear
            </button>
          )}
        </form>
        <div>
          <label htmlFor="job-status" className="mr-2 text-sm">Status</label>
          <select id="job-status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-stone-300 bg-white px-3 py-2 text-sm">
            <option value="all">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      <div className="mt-4"><ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} /></div>
      {actionError && <p className="mt-4 bg-red-50 p-3 text-sm text-red-700" role="alert">{actionError}</p>}

      {!loading && !error && (
        <>
          <p className="mt-4 text-sm text-stone-600">{pagination.total} {pagination.total === 1 ? "job" : "jobs"}</p>
          {jobs.length === 0 ? (
            <div className="mt-4 border border-line bg-white p-8 text-center">
              <p className="font-medium">No jobs match your search</p>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto border border-line bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line text-xs uppercase tracking-widest text-stone-500">
                  <tr>
                    <th scope="col" className={th}>Job</th>
                    <th scope="col" className={th}>Company</th>
                    <th scope="col" className={th}>Status</th>
                    <th scope="col" className={th}>Posted</th>
                    <th scope="col" className={th}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td className="px-4 py-3">
                        <Link to={`/jobs/${job._id}`} className="font-medium hover:text-accent">{job.title}</Link>
                        <p className="text-stone-600">{job.location} · {job.jobType}</p>
                      </td>
                      <td className="px-4 py-3">{job.employerId?.companyName || job.employerId?.name}</td>
                      <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                      <td className="whitespace-nowrap px-4 py-3">{formatDate(job.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button type="button" disabled={togglingId === job._id} onClick={() => toggleStatus(job)}
                            className="border border-line px-3 py-1 hover:border-ink disabled:opacity-50">
                            {job.status === "Open" ? "Close" : "Reopen"}
                          </button>
                          <button type="button" onClick={() => setToDelete(job)}
                            className="px-2 py-1 text-red-700 underline underline-offset-4 hover:text-red-900">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
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
