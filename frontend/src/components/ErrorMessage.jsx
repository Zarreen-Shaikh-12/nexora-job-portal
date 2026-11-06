export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm font-medium underline">
          Try again
        </button>
      )}
    </div>
  );
}
