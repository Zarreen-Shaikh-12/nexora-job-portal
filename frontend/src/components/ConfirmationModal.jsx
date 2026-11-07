import { useState } from "react";
import Modal from "./Modal";

export default function ConfirmationModal({ title, message, confirmLabel = "Confirm", danger = false, onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm(); // the parent closes the modal when this succeeds
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const confirmClass = danger ? "bg-red-700 hover:bg-red-800" : "bg-ink hover:bg-stone-700";

  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-stone-700">{message}</p>
      {error && <p className="mt-3 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={handleConfirm} disabled={busy}
          className={`px-5 py-2 text-sm text-white disabled:opacity-60 ${confirmClass}`}>
          {busy ? "Please wait..." : confirmLabel}
        </button>
        <button type="button" onClick={onCancel} disabled={busy}
          className="border border-line px-5 py-2 text-sm hover:border-ink disabled:opacity-60">
          Cancel
        </button>
      </div>
    </Modal>
  );
}
