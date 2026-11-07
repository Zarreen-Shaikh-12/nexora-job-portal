import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile } from "../../services/userService";
import { PHONE_RE, URL_RE } from "../../utils/validators";
import { extractFieldErrors } from "../../utils/apiErrors";
import { inputClass } from "../../utils/styles";
import FormField from "../../components/FormField";
import SkillsInput from "../../components/SkillsInput";

const MAX_BIO = 500;

export default function SeekerProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    bio: user.bio || "",
    resumeUrl: user.resumeUrl || "",
  });
  const [skills, setSkills] = useState(user.skills || []);
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
    if (form.bio.length > MAX_BIO) found.bio = `Bio cannot exceed ${MAX_BIO} characters`;
    if (form.resumeUrl.trim() && !URL_RE.test(form.resumeUrl.trim())) found.resumeUrl = "Enter a full link starting with http:// or https://";
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
        bio: form.bio.trim(),
        resumeUrl: form.resumeUrl.trim(),
        skills,
      });
      setUser(res.data.user); // keep the whole app in sync with the saved profile
      setSkills(res.data.user.skills || []); // show the server's normalised version
      setSuccess("Profile saved.");
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
      <h1 className="text-3xl">Profile & skills</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5 border border-line bg-white p-6">
        {success && <p className="bg-green-50 p-3 text-sm text-green-800" role="status">{success}</p>}
        {formError && <p className="bg-red-50 p-3 text-sm text-red-700" role="alert">{formError}</p>}

        <FormField id="name" label="Full name" error={errors.name}>
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

        <FormField id="bio" label="Short bio" optional error={errors.bio}>
          <textarea id="bio" name="bio" rows={4} maxLength={MAX_BIO} value={form.bio} onChange={handleChange}
            aria-invalid={!!errors.bio} aria-describedby={describe("bio")} className={inputClass(!!errors.bio)} />
          <p className="mt-1 text-right text-xs text-stone-500">{form.bio.length}/{MAX_BIO}</p>
        </FormField>

        <FormField id="skills" label="Skills" error={errors.skills}
          hint="Used to calculate your match score when you apply. Editing skills later does not change the scores of past applications.">
          <SkillsInput id="skills" skills={skills} onChange={(s) => { setSkills(s); setSuccess(""); }} />
        </FormField>

        <FormField id="resumeUrl" label="Resume link" optional error={errors.resumeUrl}
          hint="A link to your resume (Google Drive, portfolio...). File upload is a future enhancement.">
          <input id="resumeUrl" name="resumeUrl" type="url" placeholder="https://" value={form.resumeUrl}
            onChange={handleChange} aria-invalid={!!errors.resumeUrl}
            aria-describedby={errors.resumeUrl ? "resumeUrl-error" : "resumeUrl-hint"}
            className={inputClass(!!errors.resumeUrl)} />
        </FormField>

        <button type="submit" disabled={saving}
          className="bg-ink px-6 py-2 text-sm text-white hover:bg-stone-700 disabled:opacity-60">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
