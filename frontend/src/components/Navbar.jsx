import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathFor } from "../utils/roleRedirect";

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm ${isActive ? "text-ink" : "text-stone-500 hover:text-ink"}`;

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
        className="px-3 py-2 text-sm text-stone-500 hover:text-ink">
        Dashboard
      </Link>
      <button onClick={handleLogout}
        className="border border-ink px-5 py-2 text-sm text-ink hover:bg-ink hover:text-white">
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" onClick={closeMenu} className="px-3 py-2 text-sm text-stone-500 hover:text-ink">
        Login
      </Link>
      <Link to="/register" onClick={closeMenu}
        className="bg-ink px-5 py-2 text-sm text-white hover:bg-stone-700">
        Register
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4" aria-label="Main">
        <Link to="/" className="font-serif text-2xl tracking-tight text-ink">JobPortal</Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links}
          <span className="mx-3 h-5 w-px bg-line" />
          {authLinks}
        </div>

        {/* Mobile toggle */}
        <button
          className="p-2 text-ink md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="flex flex-col gap-1 border-t border-line px-4 py-3 md:hidden">
          {links}
          <div className="mt-2 flex flex-col items-start gap-2">{authLinks}</div>
        </div>
      )}
    </header>
  );
}
