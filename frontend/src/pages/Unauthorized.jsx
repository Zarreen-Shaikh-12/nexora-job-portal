import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">403 - Not allowed</h1>
      <p className="mt-2 text-gray-600">Your account role cannot open this page.</p>
      <Link to="/" className="mt-4 inline-block text-blue-600 underline">Back to home</Link>
    </div>
  );
}
