import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const roleLabel = user.role === "JobSeeker" ? "Job Seeker" : user.role;

  return (
    <header className="border-b border-line bg-paper">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="font-serif text-2xl tracking-tight">JobPortal</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/jobs" className="hidden text-stone-500 hover:text-ink sm:inline">Browse jobs</Link>
          <span className="hidden text-stone-600 sm:inline">{user.name} · {roleLabel}</span>
          <button onClick={handleLogout} className="border border-ink px-4 py-1.5 hover:bg-ink hover:text-white">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
