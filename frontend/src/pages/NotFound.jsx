import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">404 - Page not found</h1>
      <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-4 inline-block text-blue-600 underline">Back to home</Link>
    </div>
  );
}
