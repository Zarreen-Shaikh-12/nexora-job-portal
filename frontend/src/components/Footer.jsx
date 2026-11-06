import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold text-white">JobPortal</p>
          <p className="text-sm">Job Portal &amp; Recruitment Management System</p>
        </div>
        <div className="flex gap-4 text-sm">
          <Link to="/jobs" className="hover:text-white">Jobs</Link>
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
        <p className="text-xs">© {new Date().getFullYear()} JobPortal. C-DAC academic project.</p>
      </div>
    </footer>
  );
}
