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
import SeekerOverview from "./pages/seeker/SeekerOverview";
import SeekerApplications from "./pages/seeker/SeekerApplications";
import SeekerProfile from "./pages/seeker/SeekerProfile";
import EmployerOverview from "./pages/employer/EmployerOverview";
import EmployerJobs from "./pages/employer/EmployerJobs";
import EmployerJobForm from "./pages/employer/EmployerJobForm";
import JobApplicants from "./pages/employer/JobApplicants";
import EmployerProfile from "./pages/employer/EmployerProfile";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminMessages from "./pages/admin/AdminMessages";
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

      {/* Job Seeker dashboard */}
      <Route element={<RoleBasedRoute allowedRoles={["JobSeeker"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/seeker" element={<SeekerOverview />} />
          <Route path="/dashboard/seeker/applications" element={<SeekerApplications />} />
          <Route path="/dashboard/seeker/profile" element={<SeekerProfile />} />
        </Route>
      </Route>

      {/* Employer dashboard */}
      <Route element={<RoleBasedRoute allowedRoles={["Employer"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/employer" element={<EmployerOverview />} />
          <Route path="/dashboard/employer/jobs" element={<EmployerJobs />} />
          <Route path="/dashboard/employer/post-job" element={<EmployerJobForm />} />
          <Route path="/dashboard/employer/jobs/:id/edit" element={<EmployerJobForm />} />
          <Route path="/dashboard/employer/jobs/:jobId/applicants" element={<JobApplicants />} />
          <Route path="/dashboard/employer/profile" element={<EmployerProfile />} />
        </Route>
      </Route>

      {/* Admin dashboard */}
      <Route element={<RoleBasedRoute allowedRoles={["Admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/admin" element={<AdminOverview />} />
          <Route path="/dashboard/admin/users" element={<AdminUsers />} />
          <Route path="/dashboard/admin/jobs" element={<AdminJobs />} />
          <Route path="/dashboard/admin/messages" element={<AdminMessages />} />
        </Route>
      </Route>
    </Routes>
  );
}
