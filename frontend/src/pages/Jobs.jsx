import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getJobs } from "../services/jobService";
import SearchBar from "../components/SearchBar";
import JobFilters from "../components/JobFilters";
import JobCard from "../components/JobCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const PAGE_SIZE = 9;

export default function Jobs() {
  // The URL is the single source of truth for search, filters and page
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  const jobType = searchParams.get("jobType") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getJobs({ search, location, jobType, sort, page, limit: PAGE_SIZE })
      .then((res) => {
        if (!active) return;
        setJobs(res.data.jobs);
        setPagination(res.data.pagination);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => { active = false; }; // ignore outdated responses
  }, [search, location, jobType, sort, page, attempt]);

  // Merge changes into the URL. Empty values are removed. Any change except
  // "page" itself resets to page 1.
  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!("page" in changes)) next.delete("page");
    setSearchParams(next);
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage > 1 ? String(newPage) : "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-medium">Browse jobs</h1>

      <div className="mt-4 rounded-lg bg-white p-4 border border-line">
        {/* key remounts the bar when the URL changes (e.g. browser back button) */}
        <SearchBar key={`${search}|${location}`} initialSearch={search} initialLocation={location}
          onSearch={updateParams} />
        <div className="mt-4">
          <JobFilters jobType={jobType} sort={sort} onChange={(name, value) => updateParams({ [name]: value === "newest" ? "" : value })} />
        </div>
      </div>

      <div className="mt-6">
        {loading && <LoadingSpinner />}
        <ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} />

        {!loading && !error && (
          <>
            <p className="mb-3 text-sm text-stone-600">
              {pagination.total} {pagination.total === 1 ? "job" : "jobs"} found
            </p>
            {jobs.length === 0 ? (
              <div className="rounded-lg bg-white p-10 text-center border border-line">
                <p className="text-lg font-medium">No jobs match your search</p>
                <p className="mt-1 text-sm text-stone-600">Try a different title, location, or clear the filters.</p>
                <button onClick={() => setSearchParams({})}
                  className="mt-4 rounded bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => <JobCard key={job._id} job={job} />)}
              </div>
            )}
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}
