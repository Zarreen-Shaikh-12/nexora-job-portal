// variant: "matched" (solid border + tick) or "missing" (dashed border)
export default function SkillList({ title, skills = [], variant }) {
  const matched = variant === "matched";
  const chip = matched ? "border-ink text-ink" : "border-dashed border-stone-400 text-stone-500";

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest text-stone-500">{title}</p>
      {skills.length === 0 ? (
        <p className="mt-1 text-sm text-stone-500">None</p>
      ) : (
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <li key={skill} className={`border px-2 py-0.5 text-xs ${chip}`}>
              {matched && "✓ "}{skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
