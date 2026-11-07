import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import SeekerOverview from "./pages/seeker/SeekerOverview";
import SeekerApplications from "./pages/seeker/SeekerApplications";
import SeekerProfile from "./pages/seeker/SeekerProfile";
import RoleBasedRoute from "./routes/RoleBasedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Job Seeker dashboard: role guard first, then the dashboard shell */}
      <Route element={<RoleBasedRoute allowedRoles={["JobSeeker"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/seeker" element={<SeekerOverview />} />
          <Route path="/dashboard/seeker/applications" element={<SeekerApplications />} />
          <Route path="/dashboard/seeker/profile" element={<SeekerProfile />} />
        </Route>
      </Route>

      {/* Employer and Admin: real versions in Steps 10B and 10C */}
      <Route element={<RoleBasedRoute allowedRoles={["Employer"]} />}>
        <Route path="/dashboard/employer" element={<DashboardPlaceholder title="Employer Dashboard" />} />
      </Route>
      <Route element={<RoleBasedRoute allowedRoles={["Admin"]} />}>
        <Route path="/dashboard/admin" element={<DashboardPlaceholder title="Admin Dashboard" />} />
      </Route>
    </Routes>
  );
}
