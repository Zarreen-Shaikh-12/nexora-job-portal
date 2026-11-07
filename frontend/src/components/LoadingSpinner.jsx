export default function LoadingSpinner({ fullScreen = false }) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "py-10"}`}>
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-ink"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
