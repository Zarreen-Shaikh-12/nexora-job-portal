export const inputClass = (hasError) =>
  `w-full rounded border bg-white px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-ink ${
    hasError ? "border-red-500" : "border-stone-300"
  }`;
