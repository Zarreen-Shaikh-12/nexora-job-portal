import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useMyApplications } from "../../hooks/useMyApplications";
import ApplicationCard from "../../components/ApplicationCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

export default function SeekerOverview() {
  const { user } = useAuth();
  const { applications, loading, error, reload } = useMyApplications();

  const count = (status) => applications.filter((a) => a.status === status).length;
  const stats = [
    ["Total applications", applications.length],
    ["Awaiting review", count("Applied")],
    ["Shortlisted", count("Shortlisted")],
    ["Rejected", count("Rejected")],
  ];
  const safeResume = /^https?:\/\//i.test(user.resumeUrl || "");

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl">Welcome, {user.name.split(" ")[0]}</h1>

      {/* Profile overview */}
      <section className="mt-6 border border-line bg-white p-6" aria-label="Profile overview">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl">{user.name}</h2>
            <p className="text-sm text-stone-600">{[user.email, user.phone].filter(Boolean).join(" · ")}</p>
          </div>
          <Link to="/dashboard/seeker/profile" className="text-sm underline underline-offset-4 hover:text-accent">
            Edit profile
          </Link>
        </div>
        {user.bio && <p className="mt-3 text-sm text-stone-700">{user.bio}</p>}

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-widest text-stone-500">Skills</p>
          {user.skills?.length ? (
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {user.skills.map((s) => (
                <li key={s} className="border border-line px-2 py-0.5 text-xs text-stone-600">{s}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-stone-600">
              No skills yet. Your match scores depend on them.{" "}
              <Link to="/dashboard/seeker/profile" className="underline underline-offset-4 hover:text-accent">Add skills</Link>
            </p>
          )}
        </div>

        <p className="mt-4 text-sm">
          {safeResume ? (
            <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-accent">View my resume link</a>
          ) : (
            <span className="text-stone-600">No resume link added yet.</span>
          )}
        </p>
      </section>

      {loading && <LoadingSpinner />}
      <div className="mt-6"><ErrorMessage message={error} onRetry={reload} /></div>

      {!loading && !error && (
        <>
          <section aria-label="Application statistics"
            className="mt-6 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
            {stats.map(([label, value]) => (
              <div key={label} className="bg-paper p-5 text-center">
                <p className="font-serif text-3xl">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-stone-500">{label}</p>
              </div>
            ))}
          </section>

          <section className="mt-10">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl">Recent applications</h2>
              {applications.length > 0 && (
                <Link to="/dashboard/seeker/applications" className="text-sm underline underline-offset-4 hover:text-accent">
                  View all
                </Link>
              )}
            </div>
            {applications.length === 0 ? (
              <div className="mt-4 border border-line bg-white p-8 text-center">
                <p className="font-medium">You have not applied to any jobs yet</p>
                <Link to="/jobs" className="mt-4 inline-block bg-ink px-5 py-2 text-sm text-white hover:bg-stone-700">
                  Browse jobs
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {applications.slice(0, 3).map((a) => <ApplicationCard key={a._id} application={a} />)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
