import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import api from "./services/api";

function Home() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/stats").then((res) => setStats(res.data.stats)).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-3xl font-bold">Job Portal (home placeholder)</h1>
      <Link to="/login" className="mt-3 inline-block text-blue-600 underline">Go to login</Link>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {stats && <pre className="mt-4 rounded bg-gray-100 p-3 text-sm">{JSON.stringify(stats, null, 2)}</pre>}
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">403 - Not allowed</h1>
      <p className="mt-2">Your role cannot open this page.</p>
      <Link to="/" className="mt-3 inline-block text-blue-600 underline">Back to home</Link>
    </div>
  );
}

function NotFound() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">404 - Page not found</h1>
      <Link to="/" className="mt-3 inline-block text-blue-600 underline">Back to home</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<RoleBasedRoute allowedRoles={["JobSeeker"]} />}>
        <Route path="/dashboard/seeker" element={<DashboardPlaceholder title="Job Seeker Dashboard" />} />
      </Route>
      <Route element={<RoleBasedRoute allowedRoles={["Employer"]} />}>
        <Route path="/dashboard/employer" element={<DashboardPlaceholder title="Employer Dashboard" />} />
      </Route>
      <Route element={<RoleBasedRoute allowedRoles={["Admin"]} />}>
        <Route path="/dashboard/admin" element={<DashboardPlaceholder title="Admin Dashboard" />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
