import { getPasswordStrength } from "../utils/passwordStrength";

// Full class names (not built by string concatenation) so Tailwind can detect them
const COLORS = { 1: "bg-red-500", 2: "bg-orange-500", 3: "bg-yellow-500", 4: "bg-green-600" };

export default function PasswordStrength({ password }) {
  const { score, label } = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-1.5 flex-1 rounded ${i <= score ? COLORS[score] : "bg-gray-200"}`} />
        ))}
      </div>
      <p className="mt-1 text-xs text-gray-600">
        Strength: <strong>{label}</strong>. Use 8+ characters with upper and lower case, a number and a symbol.
      </p>
    </div>
  );
}
