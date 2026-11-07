import { useState } from "react";
import { inputClass } from "../utils/styles";

const MAX_SKILLS = 50;
const MAX_LENGTH = 50;

// Same normalization idea as the backend: trim, lowercase, collapse spaces
const normalizeSkill = (text) => text.trim().toLowerCase().replace(/\s+/g, " ");

export default function SkillsInput({ id, skills, onChange }) {
  const [text, setText] = useState("");

  const addSkill = (raw) => {
    const skill = normalizeSkill(raw);
    if (!skill || skill.length > MAX_LENGTH) return;
    if (skills.length >= MAX_SKILLS || skills.includes(skill)) return;
    onChange([...skills, skill]);
  };

  const commit = () => {
    addSkill(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // Enter must not submit the form
      commit();
    } else if (e.key === "Backspace" && !text && skills.length > 0) {
      onChange(skills.slice(0, -1));
    }
  };

  return (
    <div>
      <input
        id={id}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder="Type a skill and press Enter (e.g. react)"
        maxLength={MAX_LENGTH}
        aria-describedby={`${id}-hint`}
        className={inputClass(false)}
      />
      {skills.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2" aria-label="Added skills">
          {skills.map((skill) => (
            <li key={skill} className="flex items-center gap-1 rounded bg-accent-soft px-2 py-1 text-sm text-accent">
              {skill}
              <button
                type="button"
                onClick={() => onChange(skills.filter((s) => s !== skill))}
                aria-label={`Remove ${skill}`}
                className="font-medium text-accent hover:text-red-600"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
