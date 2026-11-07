import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useMyJobs } from "../../hooks/useMyJobs";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

export default function EmployerOverview() {
  const { user } = useAuth();
  const { jobs, loading, error, reload } = useMyJobs();

  const open = jobs.filter((j) => j.status === "Open").length;
  const stats = [["Total jobs", jobs.length], ["Open", open], ["Closed", jobs.length - open]];
  const safeSite = /^https?:\/\//i.test(user.companyWebsite || "");

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl">Welcome, {user.name.split(" ")[0]}</h1>

      <section className="mt-6 border border-line bg-white p-6" aria-label="Company profile">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl">{user.companyName || "Company name not set"}</h2>
            <p className="text-sm text-stone-600">{[user.name, user.email, user.phone].filter(Boolean).join(" · ")}</p>
          </div>
          <Link to="/dashboard/employer/profile" className="text-sm underline underline-offset-4 hover:text-accent">
            Edit
          </Link>
        </div>
        {user.companyDescription && <p className="mt-3 text-sm text-stone-700">{user.companyDescription}</p>}
        {safeSite && (
          <a href={user.companyWebsite} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-block text-sm underline underline-offset-4 hover:text-accent">
            Company website
          </a>
        )}
      </section>

      {loading && <LoadingSpinner />}
      <div className="mt-6"><ErrorMessage message={error} onRetry={reload} /></div>

      {!loading && !error && (
        <>
          <section aria-label="Job statistics" className="mt-6 grid grid-cols-3 gap-px border border-line bg-line">
            {stats.map(([label, value]) => (
              <div key={label} className="bg-paper p-5 text-center">
                <p className="font-serif text-3xl">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-stone-500">{label}</p>
              </div>
            ))}
          </section>

          <section className="mt-10">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl">Recent jobs</h2>
              {jobs.length > 0 && (
                <Link to="/dashboard/employer/jobs" className="text-sm underline underline-offset-4 hover:text-accent">
                  View all
                </Link>
              )}
            </div>
            {jobs.length === 0 ? (
              <div className="mt-4 border border-line bg-white p-8 text-center">
                <p className="font-medium">You have not posted any jobs yet</p>
                <Link to="/dashboard/employer/post-job"
                  className="mt-4 inline-block bg-ink px-5 py-2 text-sm text-white hover:bg-stone-700">
                  Post your first job
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {jobs.slice(0, 3).map((job) => (
                  <li key={job._id}
                    className="flex flex-wrap items-center justify-between gap-3 border border-line bg-white p-4">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-stone-600">{job.location} · {job.jobType}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={job.status} />
                      <Link to={`/dashboard/employer/jobs/${job._id}/applicants`}
                        className="text-sm underline underline-offset-4 hover:text-accent">
                        Applicants
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
