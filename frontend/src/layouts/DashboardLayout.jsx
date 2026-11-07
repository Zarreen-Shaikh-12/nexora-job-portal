import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardSidebar from "../components/DashboardSidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />
      <div className="flex flex-1 flex-col md:flex-row">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 px-4 py-8 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
