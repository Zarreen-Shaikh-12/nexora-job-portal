import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats } from "../../services/adminService";
import { formatDate, roleLabel } from "../../utils/formatters";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

function RecentList({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl">{title}</h2>
      <ul className="mt-4 divide-y divide-line border border-line bg-white">{children}</ul>
    </section>
  );
}

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getAdminStats()
      .then((res) => active && setData(res.data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [attempt]);

  const s = data?.stats;
  const items = s && [
    ["Total users", s.totalUsers],
    ["Employers", s.totalEmployers],
    ["Job seekers", s.totalJobSeekers],
    ["Total jobs", s.totalJobs, `${s.openJobs} open`],
    ["Applications", s.totalApplications],
    ["Unread messages", s.unreadMessages],
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl">Platform overview</h1>

      {loading && <LoadingSpinner />}
      <div className="mt-4"><ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} /></div>

      {data && (
        <>
          <section aria-label="Platform statistics" className="mt-6 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3">
            {items.map(([label, value, hint]) => (
              <div key={label} className="bg-paper p-5 text-center">
                <p className="font-serif text-3xl">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-stone-500">{label}</p>
                {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
              </div>
            ))}
          </section>
          {s.unreadMessages > 0 && (
            <p className="mt-3 text-sm">
              <Link to="/dashboard/admin/messages" className="underline underline-offset-4 hover:text-accent">
                You have {s.unreadMessages} unread {s.unreadMessages === 1 ? "message" : "messages"}
              </Link>
            </p>
          )}

          <RecentList title="Recent users">
            {data.recent.users.map((u) => (
              <li key={u._id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-stone-600">{u.email}</p>
                </div>
                <p className="text-stone-500">{roleLabel(u.role)} · joined {formatDate(u.createdAt)}</p>
              </li>
            ))}
          </RecentList>

          <RecentList title="Recent jobs">
            {data.recent.jobs.map((j) => (
              <li key={j._id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                <div>
                  <p className="font-medium">{j.title}</p>
                  <p className="text-stone-600">{j.employerId?.companyName || j.employerId?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-stone-500">{formatDate(j.createdAt)}</span>
                  <StatusBadge status={j.status} />
                </div>
              </li>
            ))}
          </RecentList>

          <RecentList title="Recent applications">
            {data.recent.applications.map((a) => (
              <li key={a._id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                <div>
                  <p className="font-medium">{a.applicantId?.name || "Deleted user"}</p>
                  <p className="text-stone-600">applied for {a.jobId?.title || "a removed job"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-stone-500">{a.matchScore}% match · {formatDate(a.appliedAt)}</span>
                  <StatusBadge status={a.status} />
                </div>
              </li>
            ))}
          </RecentList>
        </>
      )}
    </div>
  );
}
