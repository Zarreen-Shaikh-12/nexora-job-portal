import { useState } from "react";
import { sendContactMessage } from "../services/contactService";
import { EMAIL_RE } from "../utils/validators";
import { extractFieldErrors } from "../utils/apiErrors";
import { inputClass } from "../utils/styles";
import FormField from "../components/FormField";

const MAX_MESSAGE = 1000;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const found = {};
    const name = form.name.trim();
    const message = form.message.trim();
    if (name.length < 2 || name.length > 60) found.name = "Name must be 2-60 characters";
    if (!EMAIL_RE.test(form.email.trim())) found.email = "Please enter a valid email";
    if (message.length < 10) found.message = "Message must be at least 10 characters";
    if (message.length > MAX_MESSAGE) found.message = `Message cannot exceed ${MAX_MESSAGE} characters`;
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const res = await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setSuccess(res.data.message);
      setForm({ name: "", email: "", message: "" }); // clear only on success
    } catch (err) {
      setErrors(extractFieldErrors(err));
      setFormError(err.message); // the form keeps the user's text so nothing is lost
    } finally {
      setSubmitting(false);
    }
  };

  const describe = (field) => (errors[field] ? `${field}-error` : undefined);

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-3">
      <section className="md:col-span-1">
        <h1 className="text-3xl font-bold">Contact us</h1>
        <p className="mt-2 text-gray-600">
          Questions, feedback or suggestions? Send us a message and we will get back to you.
        </p>
        {/* TODO: replace with your own contact details */}
        <ul className="mt-6 space-y-2 text-sm text-gray-700">
          <li>✉️ support@jobportal.example</li>
          <li>📍 Your institute / city here</li>
        </ul>
      </section>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg bg-white p-6 shadow-sm md:col-span-2">
        {success && (
          <p className="rounded bg-green-50 p-3 text-sm text-green-800" role="status">{success}</p>
        )}
        {formError && (
          <p className="rounded bg-red-50 p-3 text-sm text-red-700" role="alert">{formError}</p>
        )}

        <FormField id="name" label="Your name" error={errors.name}>
          <input id="name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange}
            aria-invalid={!!errors.name} aria-describedby={describe("name")} className={inputClass(!!errors.name)} />
        </FormField>

        <FormField id="email" label="Email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange}
            aria-invalid={!!errors.email} aria-describedby={describe("email")} className={inputClass(!!errors.email)} />
        </FormField>

        <FormField id="message" label="Message" error={errors.message}>
          <textarea id="message" name="message" rows={6} maxLength={MAX_MESSAGE} value={form.message}
            onChange={handleChange} aria-invalid={!!errors.message} aria-describedby={describe("message")}
            className={inputClass(!!errors.message)} />
          <p className="mt-1 text-right text-xs text-gray-500">{form.message.length}/{MAX_MESSAGE}</p>
        </FormField>

        <button type="submit" disabled={submitting}
          className="rounded bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
