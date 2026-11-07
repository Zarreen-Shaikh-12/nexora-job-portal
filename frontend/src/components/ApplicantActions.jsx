// Shortlist / Reject / Reset buttons, used on the applicant card and in the review modal
export default function ApplicantActions({ status, busy, onChange }) {
  const base = "px-4 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" disabled={busy || status === "Shortlisted"} onClick={() => onChange("Shortlisted")}
        className={`${base} bg-ink text-white hover:bg-stone-700`}>
        Shortlist
      </button>
      <button type="button" disabled={busy || status === "Rejected"} onClick={() => onChange("Rejected")}
        className={`${base} border border-ink hover:bg-ink hover:text-white`}>
        Reject
      </button>
      {status !== "Applied" && (
        <button type="button" disabled={busy} onClick={() => onChange("Applied")}
          className="px-2 py-1.5 text-sm text-stone-600 underline underline-offset-4 hover:text-ink disabled:opacity-50">
          Reset to Applied
        </button>
      )}
    </div>
  );
}
