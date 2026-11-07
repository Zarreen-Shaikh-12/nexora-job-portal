import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { applyToJob } from "../services/applicationService";
import { URL_RE } from "../utils/validators";
import { inputClass } from "../utils/styles";
import Modal from "./Modal";
import FormField from "./FormField";
import MatchScoreIndicator from "./MatchScoreIndicator";
import SkillList from "./SkillList";

export default function ApplicationModal({ job, onClose, onApplied }) {
  const { user } = useAuth();
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || "");
  const [urlError, setUrlError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const mySkills = user?.skills || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUrlError("");

    const url = resumeUrl.trim();
    if (url && !URL_RE.test(url)) {
      setUrlError("Enter a full link starting with http:// or https://");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { jobId: job._id };
      if (url) payload.resumeUrl = url;
      const res = await applyToJob(payload);
      setResult(res.data.application); // server-calculated score and breakdown
      onApplied(res.data.application);
    } catch (err) {
      setError(err.message); // e.g. "You have already applied to this job"
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2 of the modal: show what the server calculated
  if (result) {
    return (
      <Modal title="Application submitted" onClose={onClose}>
        <p className="text-sm text-stone-600">
          You applied for <strong>{job.title}</strong>. Here is how your skills matched:
        </p>
        <div className="mt-4"><MatchScoreIndicator score={result.matchScore} /></div>
        <div className="mt-4 space-y-3">
          <SkillList title="Matched skills" skills={result.matchedSkills} variant="matched" />
          <SkillList title="Missing skills" skills={result.missingSkills} variant="missing" />
        </div>
        <p className="mt-4 text-xs text-stone-500">
          A skill-based estimate from the skills on your profile when you applied. It is not a full resume review.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/dashboard/seeker/applications" className="bg-ink px-5 py-2 text-sm text-white hover:bg-stone-700">
            View my applications
          </Link>
          <button type="button" onClick={onClose} className="border border-line px-5 py-2 text-sm hover:border-ink">
            Close
          </button>
        </div>
      </Modal>
    );
  }

  // Step 1 of the modal: confirm and submit
  return (
    <Modal title={`Apply: ${job.title}`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {error && <p className="bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-stone-500">Required skills</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {job.requirements.map((s) => (
              <li key={s} className="border border-line px-2 py-0.5 text-xs text-stone-600">{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-stone-500">Your profile skills</p>
          {mySkills.length === 0 ? (
            <p className="mt-1 text-sm text-stone-600">
              You have no skills on your profile, so your match score will be 0%.{" "}
              <Link to="/dashboard/seeker/profile" className="underline underline-offset-4 hover:text-accent">
                Add skills first
              </Link>
            </p>
          ) : (
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {mySkills.map((s) => (
                <li key={s} className="border border-line px-2 py-0.5 text-xs text-stone-600">{s}</li>
              ))}
            </ul>
          )}
        </div>

        <FormField id="resumeUrl" label="Resume link" optional error={urlError}
          hint="Link to your resume (Google Drive, portfolio...). Leave blank to use the one on your profile.">
          <input id="resumeUrl" type="url" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://" aria-invalid={!!urlError}
            aria-describedby={urlError ? "resumeUrl-error" : "resumeUrl-hint"}
            className={inputClass(!!urlError)} />
        </FormField>

        <p className="text-xs text-stone-500">
          Your match score is calculated by the server from your profile skills at the moment you apply.
        </p>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="bg-ink px-5 py-2 text-sm text-white hover:bg-stone-700 disabled:opacity-60">
            {submitting ? "Submitting..." : "Submit application"}
          </button>
          <button type="button" onClick={onClose} className="border border-line px-5 py-2 text-sm hover:border-ink">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
