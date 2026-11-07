import { useEffect, useState } from "react";
import { getContacts, updateContactStatus } from "../../services/contactService";
import { formatDate } from "../../utils/formatters";
import StatusBadge from "../../components/StatusBadge";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

const PAGE_SIZE = 10;

export default function AdminMessages() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getContacts({ status: status || undefined, page, limit: PAGE_SIZE })
      .then((res) => {
        if (!active) return;
        setContacts(res.data.contacts);
        setPagination(res.data.pagination);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [status, page, attempt]);

  const changeStatus = async (contact, newStatus) => {
    setActionError("");
    setUpdatingId(contact._id);
    try {
      const res = await updateContactStatus(contact._id, newStatus);
      setContacts((list) => list.map((c) => (c._id === contact._id ? { ...c, status: res.data.contact.status } : c)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl">Messages</h1>
        <div>
          <label htmlFor="msg-status" className="mr-2 text-sm">Status</label>
          <select id="msg-status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="border border-stone-300 bg-white px-3 py-2 text-sm">
            <option value="">All</option>
            <option value="Unread">Unread</option>
            <option value="Replied">Replied</option>
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      <div className="mt-4"><ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} /></div>
      {actionError && <p className="mt-4 bg-red-50 p-3 text-sm text-red-700" role="alert">{actionError}</p>}

      {!loading && !error && (
        <>
          <p className="mt-4 text-sm text-stone-600">{pagination.total} {pagination.total === 1 ? "message" : "messages"}</p>
          {contacts.length === 0 ? (
            <div className="mt-4 border border-line bg-white p-8 text-center">
              <p className="font-medium">No messages here</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {contacts.map((c) => (
                <article key={c._id} className="border border-line bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg">{c.name}</h2>
                      <p className="mt-1 text-sm text-stone-600">{c.email}</p>
                      <p className="mt-1 text-xs text-stone-500">Received {formatDate(c.createdAt)}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                  {/* Rendered as plain text; React escapes it */}
                  <p className="mt-4 whitespace-pre-line text-sm text-stone-700">{c.message}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4 text-sm">
                    <a href={`mailto:${encodeURIComponent(c.email)}`}
                      className="border border-line px-4 py-1.5 hover:border-ink">
                      Reply by email
                    </a>
                    {c.status === "Unread" ? (
                      <button type="button" disabled={updatingId === c._id} onClick={() => changeStatus(c, "Replied")}
                        className="bg-ink px-4 py-1.5 text-white hover:bg-stone-700 disabled:opacity-50">
                        Mark as replied
                      </button>
                    ) : (
                      <button type="button" disabled={updatingId === c._id} onClick={() => changeStatus(c, "Unread")}
                        className="px-2 py-1.5 text-stone-600 underline underline-offset-4 hover:text-ink disabled:opacity-50">
                        Mark as unread
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
