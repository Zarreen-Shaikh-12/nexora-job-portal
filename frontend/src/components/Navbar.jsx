import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathFor } from "../utils/roleRedirect";

const linkClass = ({ isActive }) =>
  `rounded px-3 py-2 text-sm font-medium ${
    isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
  }`;

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate("/", { replace: true });
  };

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={closeMenu}>Home</NavLink>
      <NavLink to="/jobs" className={linkClass} onClick={closeMenu}>Jobs</NavLink>
      <NavLink to="/about" className={linkClass} onClick={closeMenu}>About</NavLink>
      <NavLink to="/contact" className={linkClass} onClick={closeMenu}>Contact</NavLink>
    </>
  );

  // While the session check runs, render nothing here to avoid a Login-button flicker
  const authLinks = loading ? null : user ? (
    <>
      <Link to={dashboardPathFor(user.role)} onClick={closeMenu}
        className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
        Dashboard
      </Link>
      <button onClick={handleLogout}
        className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900">
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" onClick={closeMenu}
        className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
        Login
      </Link>
      <Link to="/register" onClick={closeMenu}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
        Register
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Main">
        <Link to="/" className="text-xl font-bold text-blue-600">JobPortal</Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links}
          <span className="mx-2 h-6 w-px bg-gray-200" />
          {authLinks}
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded p-2 text-gray-700 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 py-3 md:hidden">
          {links}
          <div className="mt-2 flex flex-col items-start gap-2">{authLinks}</div>
        </div>
      )}
    </header>
  );
}
