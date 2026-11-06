export default function LoadingSpinner({ fullScreen = false }) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "py-10"}`}>
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
