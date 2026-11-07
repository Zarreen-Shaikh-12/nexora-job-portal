import { useEffect, useState } from "react";
import { deleteUser, getAdminUsers, setUserStatus } from "../../services/adminService";
import { formatDate, roleLabel } from "../../utils/formatters";
import StatusBadge from "../../components/StatusBadge";
import ConfirmationModal from "../../components/ConfirmationModal";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

const PAGE_SIZE = 10;

const deleteMessage = (u) =>
  u.role === "Employer"
    ? `${u.name} (${u.email}) will be permanently deleted, together with ALL of their jobs and every application those jobs received. This cannot be undone.`
    : `${u.name} (${u.email}) will be permanently deleted, together with all of their applications. This cannot be undone.`;

export default function AdminUsers() {
  const [role, setRole] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const [togglingId, setTogglingId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getAdminUsers({ role: role || undefined, search: search || undefined, page, limit: PAGE_SIZE })
      .then((res) => {
        if (!active) return;
        // Deleted the last item on a later page: step back one page
        if (res.data.users.length === 0 && page > 1) {
          setPage(page - 1);
          return;
        }
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [role, search, page, attempt]);

  const submitSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const toggleActive = async (u) => {
    setActionError("");
    setTogglingId(u._id);
    try {
      const res = await setUserStatus(u._id, !u.isActive);
      setUsers((list) => list.map((x) => (x._id === u._id ? { ...x, isActive: res.data.user.isActive } : x)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    await deleteUser(toDelete._id); // if this throws, ConfirmationModal shows the error
    setToDelete(null);
    setAttempt((a) => a + 1);
  };

  const th = "px-4 py-3 font-medium";

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl">Users</h1>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <form onSubmit={submitSearch} role="search" className="flex gap-2">
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <input id="user-search" type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Name or email" className="w-56 border border-stone-300 bg-white px-3 py-2 text-sm" />
          <button type="submit" className="bg-ink px-4 py-2 text-sm text-white hover:bg-stone-700">Search</button>
          {search && (
            <button type="button" onClick={clearSearch} className="px-2 text-sm underline underline-offset-4 hover:text-accent">
              Clear
            </button>
          )}
        </form>
        <div>
          <label htmlFor="user-role" className="mr-2 text-sm">Role</label>
          <select id="user-role" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}
            className="border border-stone-300 bg-white px-3 py-2 text-sm">
            <option value="">All</option>
            <option value="JobSeeker">Job Seeker</option>
            <option value="Employer">Employer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      <div className="mt-4"><ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} /></div>
      {actionError && <p className="mt-4 bg-red-50 p-3 text-sm text-red-700" role="alert">{actionError}</p>}

      {!loading && !error && (
        <>
          <p className="mt-4 text-sm text-stone-600">{pagination.total} {pagination.total === 1 ? "user" : "users"}</p>
          {users.length === 0 ? (
            <div className="mt-4 border border-line bg-white p-8 text-center">
              <p className="font-medium">No users match your search</p>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto border border-line bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line text-xs uppercase tracking-widest text-stone-500">
                  <tr>
                    <th scope="col" className={th}>User</th>
                    <th scope="col" className={th}>Role</th>
                    <th scope="col" className={th}>Status</th>
                    <th scope="col" className={th}>Joined</th>
                    <th scope="col" className={th}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{u.name}</p>
                        <p className="text-stone-600">{u.email}</p>
                      </td>
                      <td className="px-4 py-3">{roleLabel(u.role)}</td>
                      <td className="px-4 py-3"><StatusBadge status={u.isActive ? "Active" : "Deactivated"} /></td>
                      <td className="whitespace-nowrap px-4 py-3">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        {u.role === "Admin" ? (
                          <span className="text-stone-500">Protected</span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            <button type="button" disabled={togglingId === u._id} onClick={() => toggleActive(u)}
                              className="border border-line px-3 py-1 hover:border-ink disabled:opacity-50">
                              {u.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button type="button" onClick={() => setToDelete(u)}
                              className="px-2 py-1 text-red-700 underline underline-offset-4 hover:text-red-900">
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
        </>
      )}

      {toDelete && (
        <ConfirmationModal
          title="Delete this user?"
          message={deleteMessage(toDelete)}
          confirmLabel="Delete user"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
