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
      <section className="border-b border-line px-4 py-20 text-center md:py-28">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">Careers, matched by skill</p>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl leading-tight md:text-6xl">
          Find the work that fits your skills
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-stone-600">
          Browse openings, apply in one click, and see exactly how your skills match each role.
        </p>
        <div className="mx-auto mt-10 max-w-3xl border border-line bg-white p-3 text-left">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16">
        {loading && <LoadingSpinner />}
        <ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} />

        {!loading && !error && (
          <>
            {/* Statistics: gap-px on a line-coloured grid draws the thin dividers */}
            <section aria-label="Platform statistics"
              className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
              {statItems.map(([label, value]) => (
                <div key={label} className="bg-paper p-6 text-center">
                  <p className="font-serif text-4xl">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-stone-500">{label}</p>
                </div>
              ))}
            </section>

            <section className="mt-20">
              <h2 className="text-3xl">Featured jobs</h2>
              <p className="mt-1 text-sm text-stone-500">Top paying open positions</p>
              {data.featured.length === 0 ? (
                <p className="mt-4 text-stone-600">No jobs available yet.</p>
              ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-3">
                  {data.featured.map((job) => <JobCard key={job._id} job={job} />)}
                </div>
              )}
            </section>

            <section className="mt-20">
              <div className="flex items-end justify-between">
                <h2 className="text-3xl">Latest jobs</h2>
                <Link to="/jobs" className="text-sm text-ink underline underline-offset-4 hover:text-accent">
                  View all jobs →
                </Link>
              </div>
              {data.latest.length === 0 ? (
                <p className="mt-4 text-stone-600">No jobs available yet.</p>
              ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {data.latest.map((job) => <JobCard key={job._id} job={job} />)}
                </div>
              )}
            </section>

            {/* Calls to action: guests only */}
            {!user && (
              <section className="mt-20 grid md:grid-cols-2">
                <div className="bg-ink p-10 text-white">
                  <h3 className="text-2xl">Looking for a job?</h3>
                  <p className="mt-2 text-stone-300">Create a profile, add your skills, and apply today.</p>
                  <Link to="/register" className="mt-6 inline-block bg-white px-5 py-2 text-sm text-ink hover:bg-stone-200">
                    Sign up as a job seeker
                  </Link>
                </div>
                <div className="border border-line bg-white p-10">
                  <h3 className="text-2xl">Hiring talent?</h3>
                  <p className="mt-2 text-stone-600">Post jobs and rank applicants by skill match.</p>
                  <Link to="/register" className="mt-6 inline-block bg-ink px-5 py-2 text-sm text-white hover:bg-stone-700">
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
