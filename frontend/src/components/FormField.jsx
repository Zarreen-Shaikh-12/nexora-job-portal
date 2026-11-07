// Label + input slot + hint/error text. The input gets id={id}; messages use `${id}-hint` / `${id}-error`.
export default function FormField({ id, label, error, hint, optional = false, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-800">
        {label}
        {optional && <span className="font-normal text-gray-500"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">{error}</p>}
    </div>
  );
}
