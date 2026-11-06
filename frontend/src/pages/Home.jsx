import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getJobs } from "../services/jobService";
import { getPublicStats } from "../services/statsService";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ stats: null, featured: [], latest: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0); // incremented by "Try again"

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    // Three independent requests run in parallel
    Promise.all([
      getPublicStats(),
      getJobs({ sort: "salary-high", limit: 3 }), // "featured" = highest paying open jobs
      getJobs({ sort: "newest", limit: 6 }),
    ])
      .then(([statsRes, featuredRes, latestRes]) => {
        if (!active) return;
        setData({
          stats: statsRes.data.stats,
          featured: featuredRes.data.jobs,
          latest: latestRes.data.jobs,
        });
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [attempt]);

  const handleSearch = ({ search, location }) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  const statItems = data.stats && [
    ["Open jobs", data.stats.openJobs],
    ["Employers", data.stats.employers],
    ["Job seekers", data.stats.jobSeekers],
    ["Applications", data.stats.applications],
  ];

  return (
    <>
      {/* Hero: always rendered, even if the API is down */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold md:text-5xl">Find the job that fits your skills</h1>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Browse openings, apply in one click, and see how well your skills match each role.
          </p>
          <div className="mt-8 rounded-lg bg-white/10 p-4 text-left">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {loading && <LoadingSpinner />}
        <ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} />

        {!loading && !error && (
          <>
            {/* Platform statistics */}
            <section aria-label="Platform statistics" className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {statItems.map(([label, value]) => (
                <div key={label} className="rounded-lg bg-white p-4 text-center shadow-sm">
                  <p className="text-3xl font-bold text-blue-600">{value}</p>
                  <p className="text-sm text-gray-600">{label}</p>
                </div>
              ))}
            </section>

            {/* Featured */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold">Featured jobs</h2>
              <p className="text-sm text-gray-600">Top paying open positions</p>
              {data.featured.length === 0 ? (
                <p className="mt-4 text-gray-600">No jobs available yet.</p>
              ) : (
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {data.featured.map((job) => <JobCard key={job._id} job={job} />)}
                </div>
              )}
            </section>

            {/* Latest */}
            <section className="mt-12">
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold">Latest jobs</h2>
                <Link to="/jobs" className="text-sm font-medium text-blue-600 hover:underline">View all jobs →</Link>
              </div>
              {data.latest.length === 0 ? (
                <p className="mt-4 text-gray-600">No jobs available yet.</p>
              ) : (
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.latest.map((job) => <JobCard key={job._id} job={job} />)}
                </div>
              )}
            </section>

            {/* Calls to action: guests only */}
            {!user && (
              <section className="mt-12 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-blue-600 p-6 text-white">
                  <h3 className="text-xl font-bold">Looking for a job?</h3>
                  <p className="mt-1 text-blue-100">Create a profile, add your skills, and apply today.</p>
                  <Link to="/register" className="mt-4 inline-block rounded bg-white px-4 py-2 font-medium text-blue-700">
                    Sign up as a job seeker
                  </Link>
                </div>
                <div className="rounded-lg bg-gray-800 p-6 text-white">
                  <h3 className="text-xl font-bold">Hiring talent?</h3>
                  <p className="mt-1 text-gray-300">Post jobs and rank applicants by skill match.</p>
                  <Link to="/register" className="mt-4 inline-block rounded bg-white px-4 py-2 font-medium text-gray-900">
                    Sign up as an employer
                  </Link>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
