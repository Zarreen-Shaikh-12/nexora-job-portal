import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile } from "../../services/userService";
import { PHONE_RE, URL_RE } from "../../utils/validators";
import { extractFieldErrors } from "../../utils/apiErrors";
import { inputClass } from "../../utils/styles";
import FormField from "../../components/FormField";

export default function EmployerProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    companyName: user.companyName || "",
    companyWebsite: user.companyWebsite || "",
    companyDescription: user.companyDescription || "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSuccess("");
  };

  const validate = () => {
    const found = {};
    const name = form.name.trim();
    if (name.length < 2 || name.length > 60) found.name = "Name must be 2-60 characters";
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) found.phone = "Phone must be 7-15 characters (digits, +, - or spaces)";
    if (form.companyName.trim().length > 100) found.companyName = "Company name is too long";
    if (form.companyWebsite.trim() && !URL_RE.test(form.companyWebsite.trim())) {
      found.companyWebsite = "Enter a full link starting with http:// or https://";
    }
    if (form.companyDescription.length > 1000) found.companyDescription = "Description cannot exceed 1000 characters";
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      const res = await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        companyName: form.companyName.trim(),
        companyWebsite: form.companyWebsite.trim(),
        companyDescription: form.companyDescription.trim(),
      });
      setUser(res.data.user);
      setSuccess("Company profile saved.");
    } catch (err) {
      setErrors(extractFieldErrors(err));
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const describe = (field) => (errors[field] ? `${field}-error` : undefined);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl">Company profile</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5 border border-line bg-white p-6">
        {success && <p className="bg-green-50 p-3 text-sm text-green-800" role="status">{success}</p>}
        {formError && <p className="bg-red-50 p-3 text-sm text-red-700" role="alert">{formError}</p>}

        <FormField id="companyName" label="Company name" optional error={errors.companyName}>
          <input id="companyName" name="companyName" type="text" value={form.companyName} onChange={handleChange}
            aria-invalid={!!errors.companyName} aria-describedby={describe("companyName")}
            className={inputClass(!!errors.companyName)} />
        </FormField>

        <FormField id="companyWebsite" label="Company website" optional error={errors.companyWebsite}>
          <input id="companyWebsite" name="companyWebsite" type="url" placeholder="https://" value={form.companyWebsite}
            onChange={handleChange} aria-invalid={!!errors.companyWebsite} aria-describedby={describe("companyWebsite")}
            className={inputClass(!!errors.companyWebsite)} />
        </FormField>

        <FormField id="companyDescription" label="About the company" optional error={errors.companyDescription}>
          <textarea id="companyDescription" name="companyDescription" rows={5} maxLength={1000}
            value={form.companyDescription} onChange={handleChange}
            aria-invalid={!!errors.companyDescription} aria-describedby={describe("companyDescription")}
            className={inputClass(!!errors.companyDescription)} />
          <p className="mt-1 text-right text-xs text-stone-500">{form.companyDescription.length}/1000</p>
        </FormField>

        <hr className="border-line" />

        <FormField id="name" label="Your name" error={errors.name}>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
            aria-invalid={!!errors.name} aria-describedby={describe("name")} className={inputClass(!!errors.name)} />
        </FormField>

        <FormField id="email" label="Email" hint="Your email cannot be changed here.">
          <input id="email" type="email" value={user.email} readOnly disabled aria-describedby="email-hint"
            className="w-full border border-stone-200 bg-stone-100 px-3 py-2 text-stone-500" />
        </FormField>

        <FormField id="phone" label="Phone" optional error={errors.phone}>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
            aria-invalid={!!errors.phone} aria-describedby={describe("phone")} className={inputClass(!!errors.phone)} />
        </FormField>

        <button type="submit" disabled={saving}
          className="bg-ink px-6 py-2 text-sm text-white hover:bg-stone-700 disabled:opacity-60">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
