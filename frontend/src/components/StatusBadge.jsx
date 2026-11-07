// The only coloured element in the UI: colour carries real meaning here
const STYLES = {
  Applied: "bg-stone-100 text-stone-700",
  Shortlisted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Open: "bg-green-100 text-green-800",
  Closed: "bg-stone-200 text-stone-700",
  Unread: "bg-amber-100 text-amber-800",
  Replied: "bg-green-100 text-green-800",
  Active: "bg-green-100 text-green-800",
  Deactivated: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-medium ${STYLES[status] || "bg-stone-100 text-stone-700"}`}>
      {status}
    </span>
  );
}
