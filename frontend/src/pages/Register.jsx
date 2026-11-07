import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathFor } from "../utils/roleRedirect";
import { EMAIL_RE, PHONE_RE } from "../utils/validators";
import { extractFieldErrors } from "../utils/apiErrors";
import { inputClass } from "../utils/styles";
import FormField from "../components/FormField";
import PasswordInput from "../components/PasswordInput";
import PasswordStrength from "../components/PasswordStrength";
import SkillsInput from "../components/SkillsInput";

const ROLE_OPTIONS = [
  { value: "JobSeeker", title: "Job Seeker", text: "Find jobs and apply" },
  { value: "Employer", title: "Employer", text: "Post jobs and hire" },
];

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "", role: "JobSeeker", companyName: "",
  });
  const [skills, setSkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={dashboardPathFor(user.role)} replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const found = {};
    const name = form.name.trim();
    if (name.length < 2 || name.length > 60) found.name = "Name must be 2-60 characters";
    if (!EMAIL_RE.test(form.email.trim())) found.email = "Please enter a valid email";
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) {
      found.phone = "Phone must be 7-15 characters (digits, +, - or spaces)";
    }
    if (form.password.length < 6) found.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) found.confirmPassword = "Passwords do not match";
    if (form.role === "Employer" && form.companyName.trim().length > 100) {
      found.companyName = "Company name is too long";
    }
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Build the payload: confirmPassword is never sent; role-specific fields only for that role
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    };
    if (form.phone.trim()) payload.phone = form.phone.trim();
    if (form.role === "JobSeeker") payload.skills = skills;
    if (form.role === "Employer" && form.companyName.trim()) payload.companyName = form.companyName.trim();

    setSubmitting(true);
    try {
      const created = await register(payload);
      navigate(dashboardPathFor(created.role), { replace: true });
    } catch (err) {
      const serverErrors = extractFieldErrors(err);
      if (err.response?.status === 409) serverErrors.email = err.message; // duplicate email
      setErrors(serverErrors);
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const describe = (field) => (errors[field] ? `${field}-error` : undefined);

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg bg-white p-6 border border-line">
        <h1 className="text-2xl font-medium">Create your account</h1>

        {formError && (
          <p className="rounded bg-red-50 p-3 text-sm text-red-700" role="alert">{formError}</p>
        )}

        <fieldset>
          <legend className="mb-1 text-sm font-medium text-stone-800">I am a</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((opt) => (
              <label key={opt.value}
                className={`cursor-pointer rounded border p-3 text-sm ${
                  form.role === opt.value ? "border-ink bg-accent-soft" : "border-stone-300"}`}>
                <input type="radio" name="role" value={opt.value} checked={form.role === opt.value}
                  onChange={handleChange} className="mr-2" />
                <span className="font-medium">{opt.title}</span>
                <span className="block text-xs text-stone-600">{opt.text}</span>
              </label>
            ))}
          </div>
          {errors.role && <p className="mt-1 text-sm text-red-600" role="alert">{errors.role}</p>}
        </fieldset>

        <FormField id="name" label="Full name" error={errors.name}>
          <input id="name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange}
            aria-invalid={!!errors.name} aria-describedby={describe("name")} className={inputClass(!!errors.name)} />
        </FormField>

        <FormField id="email" label="Email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange}
            aria-invalid={!!errors.email} aria-describedby={describe("email")} className={inputClass(!!errors.email)} />
        </FormField>

        <FormField id="phone" label="Phone" optional error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange}
            aria-invalid={!!errors.phone} aria-describedby={describe("phone")} className={inputClass(!!errors.phone)} />
        </FormField>

        {form.role === "JobSeeker" ? (
          <FormField id="skills" label="Your skills" optional error={errors.skills}
            hint="These are compared with each job's required skills to calculate your match score.">
            <SkillsInput id="skills" skills={skills} onChange={setSkills} />
          </FormField>
        ) : (
          <FormField id="companyName" label="Company name" optional error={errors.companyName}>
            <input id="companyName" name="companyName" type="text" value={form.companyName} onChange={handleChange}
              aria-invalid={!!errors.companyName} aria-describedby={describe("companyName")}
              className={inputClass(!!errors.companyName)} />
          </FormField>
        )}

        <FormField id="password" label="Password" error={errors.password}>
          <PasswordInput id="password" name="password" value={form.password} onChange={handleChange}
            autoComplete="new-password" hasError={!!errors.password} describedBy={describe("password")} />
          <PasswordStrength password={form.password} />
        </FormField>

        <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
          <PasswordInput id="confirmPassword" name="confirmPassword" value={form.confirmPassword}
            onChange={handleChange} autoComplete="new-password" hasError={!!errors.confirmPassword}
            describedBy={describe("confirmPassword")} />
        </FormField>

        <button type="submit" disabled={submitting}
          className="w-full rounded bg-ink py-2 font-medium text-white hover:bg-stone-700 disabled:opacity-60">
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-stone-600">
          Already registered? <Link to="/login" className="font-medium text-accent hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
