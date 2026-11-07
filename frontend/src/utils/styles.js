export const inputClass = (hasError) =>
  `w-full rounded border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 ${
    hasError ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
  }`;
