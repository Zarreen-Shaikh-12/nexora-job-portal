import { useState } from "react";
import { inputClass } from "../utils/styles";

export default function PasswordInput({ id, name, value, onChange, autoComplete, hasError, describedBy }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={`${inputClass(hasError)} pr-16`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
