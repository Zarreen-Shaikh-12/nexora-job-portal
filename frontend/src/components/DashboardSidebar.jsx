import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Links per role. Employer and Admin get their real links in Steps 10B and 10C.
const LINKS = {
  JobSeeker: [
    { to: "/dashboard/seeker", label: "Overview", end: true },
    { to: "/dashboard/seeker/applications", label: "My applications" },
    { to: "/dashboard/seeker/profile", label: "Profile & skills" },
  ],
//   Employer: [{ to: "/dashboard/employer", label: "Overview", end: true }],
    Employer: [
    { to: "/dashboard/employer", label: "Overview", end: true },
    { to: "/dashboard/employer/jobs", label: "My jobs" },
    { to: "/dashboard/employer/post-job", label: "Post a job" },
    { to: "/dashboard/employer/profile", label: "Company profile" },
  ],
    Admin: [
    { to: "/dashboard/admin", label: "Overview", end: true },
    { to: "/dashboard/admin/users", label: "Users" },
    { to: "/dashboard/admin/jobs", label: "Jobs" },
    { to: "/dashboard/admin/messages", label: "Messages" },
  ],
};

const linkClass = ({ isActive }) =>
  `whitespace-nowrap px-3 py-2 text-sm ${
    isActive ? "bg-accent-soft text-ink" : "text-stone-600 hover:text-ink"
  }`;

export default function DashboardSidebar() {
  const { user } = useAuth();
  const links = LINKS[user.role] || [];

  // One element: a vertical sidebar on desktop, a horizontal scrolling strip on mobile
  return (
    <aside className="border-b border-line md:w-56 md:shrink-0 md:border-b-0 md:border-r">
      <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto px-4 py-3 md:flex-col md:px-3 md:py-6">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>
        ))}
      </nav>
    </aside>
  );
}
