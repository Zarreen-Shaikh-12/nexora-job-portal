// Full class names (not built by concatenation) so Tailwind can detect them
const bandFor = (score) => {
  if (score >= 75) return { label: "Strong match", bar: "bg-ink" };
  if (score >= 40) return { label: "Partial match", bar: "bg-accent" };
  return { label: "Low match", bar: "bg-stone-400" };
};

export default function MatchScoreIndicator({ score = 0 }) {
  const value = Math.min(Math.max(Number(score) || 0, 0), 100);
  const { label, bar } = bandFor(value);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-serif text-2xl">{value}%</span>
        <span className="text-xs uppercase tracking-widest text-stone-500">{label}</span>
      </div>
      <div
        role="meter"
        aria-label="Match score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value}% - ${label}`}
        className="mt-1 h-1.5 w-full bg-stone-200"
      >
        <div className={`h-full ${bar}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
