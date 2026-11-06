import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import RoleBasedRoute from "./routes/RoleBasedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public pages share Navbar + Footer through MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Temporary: moves into MainLayout in Step 9B */}
      <Route path="/login" element={<Login />} />

      {/* Dashboards: real versions with their own layout in Step 10 */}
      <Route element={<RoleBasedRoute allowedRoles={["JobSeeker"]} />}>
        <Route path="/dashboard/seeker" element={<DashboardPlaceholder title="Job Seeker Dashboard" />} />
      </Route>
      <Route element={<RoleBasedRoute allowedRoles={["Employer"]} />}>
        <Route path="/dashboard/employer" element={<DashboardPlaceholder title="Employer Dashboard" />} />
      </Route>
      <Route element={<RoleBasedRoute allowedRoles={["Admin"]} />}>
        <Route path="/dashboard/admin" element={<DashboardPlaceholder title="Admin Dashboard" />} />
      </Route>
    </Routes>
  );
}
