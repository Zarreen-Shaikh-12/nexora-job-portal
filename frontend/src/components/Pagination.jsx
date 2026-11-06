export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  const btn = "rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50";
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4">
      <button className={btn} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
      <span className="text-sm text-gray-700">Page {page} of {pages}</span>
      <button className={btn} disabled={page >= pages} onClick={() => onPageChange(page + 1)}>Next</button>
    </nav>
  );
}
