import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathFor } from "../utils/roleRedirect";
import { EMAIL_RE } from "../utils/validators";
import { inputClass } from "../utils/styles";
import FormField from "../components/FormField";
import PasswordInput from "../components/PasswordInput";

// Development convenience only (shown when import.meta.env.DEV is true)
const DEMO_ACCOUNTS = [
  { label: "Job Seeker", email: "kiran@demo.com" },
  { label: "Employer", email: "priya@techcorp.com" },
  { label: "Admin", email: "admin@jobportal.com" },
];
const DEMO_PASSWORD = "Password@123";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in: go straight to the right dashboard (all hooks are above this line)
  if (user) return <Navigate to={dashboardPathFor(user.role)} replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const found = {};
    if (!EMAIL_RE.test(form.email.trim())) found.email = "Please enter a valid email";
    if (!form.password) found.password = "Password is required";
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const loggedIn = await login({ email: form.email.trim(), password: form.password });
      const from = location.state?.from?.pathname;
      navigate(from || dashboardPathFor(loggedIn.role), { replace: true });
    } catch (err) {
      setFormError(err.message); // e.g. "Invalid email or password"
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-gray-600">Log in to manage your applications or job postings.</p>

        {formError && (
          <p className="rounded bg-red-50 p-3 text-sm text-red-700" role="alert">{formError}</p>
        )}

        <FormField id="email" label="Email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email}
            onChange={handleChange} aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass(!!errors.email)} />
        </FormField>

        <FormField id="password" label="Password" error={errors.password}>
          <PasswordInput id="password" name="password" value={form.password} onChange={handleChange}
            autoComplete="current-password" hasError={!!errors.password}
            describedBy={errors.password ? "password-error" : undefined} />
        </FormField>

        <button type="submit" disabled={submitting}
          className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          New here? <Link to="/register" className="font-medium text-blue-600 hover:underline">Create an account</Link>
        </p>

        {import.meta.env.DEV && (
          <div className="rounded border border-dashed border-gray-300 p-3">
            <p className="mb-2 text-xs font-medium text-gray-500">Dev only: fill a demo account</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button key={acc.email} type="button"
                  onClick={() => { setForm({ email: acc.email, password: DEMO_PASSWORD }); setErrors({}); }}
                  className="rounded bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200">
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
