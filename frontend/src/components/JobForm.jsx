import { useState } from "react";
import { extractFieldErrors } from "../utils/apiErrors";
import { inputClass } from "../utils/styles";
import FormField from "./FormField";
import SkillsInput from "./SkillsInput";

const toForm = (job) => ({
  title: job?.title || "",
  description: job?.description || "",
  location: job?.location || "",
  jobType: job?.jobType || "Full-time",
  salaryMin: job?.salaryRange?.min ? String(job.salaryRange.min) : "",
  salaryMax: job?.salaryRange?.max ? String(job.salaryRange.max) : "",
  status: job?.status || "Open",
});

export default function JobForm({ initial, isEdit = false, onSubmit }) {
  const [form, setForm] = useState(() => toForm(initial));
  const [requirements, setRequirements] = useState(initial?.requirements || []);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const found = {};
    const title = form.title.trim();
    if (title.length < 3 || title.length > 100) found.title = "Title must be 3-100 characters";
    if (form.description.trim().length < 10) found.description = "Description must be at least 10 characters";
    if (!form.location.trim()) found.location = "Location is required";
    if (requirements.length === 0) found.requirements = "Add at least one required skill";

    const min = form.salaryMin.trim();
    const max = form.salaryMax.trim();
    if (min || max) {
      if (!min || !max) found.salary = "Enter both minimum and maximum salary, or leave both blank";
      else if (Number.isNaN(Number(min)) || Number.isNaN(Number(max)) || Number(min) < 0 || Number(max) < 0) {
        found.salary = "Salary must be a number, 0 or more";
      } else if (Number(max) < Number(min)) found.salary = "Maximum salary must be at least the minimum";
    }
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const min = form.salaryMin.trim();
    const max = form.salaryMax.trim();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      jobType: form.jobType,
      requirements,
      salaryRange: { min: min ? Number(min) : 0, max: max ? Number(max) : 0 },
    };
    if (isEdit) payload.status = form.status;

    setSaving(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      const serverErrors = extractFieldErrors(err);
      if (serverErrors.salaryRange) serverErrors.salary = serverErrors.salaryRange;
      setErrors(serverErrors);
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const describe = (field) => (errors[field] ? `${field}-error` : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 border border-line bg-white p-6">
      {formError && <p className="bg-red-50 p-3 text-sm text-red-700" role="alert">{formError}</p>}

      <FormField id="title" label="Job title" error={errors.title}>
        <input id="title" name="title" type="text" value={form.title} onChange={handleChange}
          aria-invalid={!!errors.title} aria-describedby={describe("title")} className={inputClass(!!errors.title)} />
      </FormField>

      <FormField id="description" label="Description" error={errors.description}>
        <textarea id="description" name="description" rows={6} value={form.description} onChange={handleChange}
          aria-invalid={!!errors.description} aria-describedby={describe("description")}
          className={inputClass(!!errors.description)} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="location" label="Location" error={errors.location}>
          <input id="location" name="location" type="text" value={form.location} onChange={handleChange}
            aria-invalid={!!errors.location} aria-describedby={describe("location")}
            className={inputClass(!!errors.location)} />
        </FormField>
        <FormField id="jobType" label="Job type" error={errors.jobType}>
          <select id="jobType" name="jobType" value={form.jobType} onChange={handleChange} className={inputClass(false)}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
          </select>
        </FormField>
      </div>

      <FormField id="salaryMin" label="Salary range (₹)" optional error={errors.salary}
        hint="Enter both values, or leave both blank to show &quot;Not disclosed&quot;.">
        <div className="grid grid-cols-2 gap-3">
          <input id="salaryMin" name="salaryMin" type="number" min="0" inputMode="numeric" placeholder="Minimum"
            aria-label="Minimum salary" value={form.salaryMin} onChange={handleChange}
            aria-invalid={!!errors.salary} aria-describedby={errors.salary ? "salaryMin-error" : "salaryMin-hint"}
            className={inputClass(!!errors.salary)} />
          <input id="salaryMax" name="salaryMax" type="number" min="0" inputMode="numeric" placeholder="Maximum"
            aria-label="Maximum salary" value={form.salaryMax} onChange={handleChange}
            aria-invalid={!!errors.salary} className={inputClass(!!errors.salary)} />
        </div>
      </FormField>

      <FormField id="requirements" label="Required skills" error={errors.requirements}
        hint={
          isEdit
            ? "Use short keywords such as react or node.js, not sentences. Candidates are matched by exact keyword. Changing skills does not re-score applicants who have already applied."
            : "Use short keywords such as react or node.js, not sentences. Candidates are matched by exact keyword."
        }>
        <SkillsInput id="requirements" skills={requirements}
          onChange={(s) => { setRequirements(s); setErrors((p) => ({ ...p, requirements: undefined })); }} />
      </FormField>

      {isEdit && (
        <FormField id="status" label="Status" hint="Closed jobs are hidden from the public list and cannot receive applications.">
          <select id="status" name="status" value={form.status} onChange={handleChange} className={inputClass(false)}>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </FormField>
      )}

      <button type="submit" disabled={saving}
        className="bg-ink px-6 py-2 text-sm text-white hover:bg-stone-700 disabled:opacity-60">
        {saving ? "Saving..." : isEdit ? "Save changes" : "Post job"}
      </button>
    </form>
  );
}
