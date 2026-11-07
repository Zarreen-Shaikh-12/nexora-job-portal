import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPlaceholder({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-medium">{title}</h1>
      <p className="mt-2 text-stone-700">
        Logged in as <strong>{user.name}</strong> ({user.role})
      </p>
      <button onClick={handleLogout} className="mt-4 rounded bg-stone-800 px-4 py-2 text-white">
        Logout
      </button>
    </div>
  );
}
