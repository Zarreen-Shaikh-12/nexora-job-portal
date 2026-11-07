import { formatDate } from "../utils/formatters";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import MatchScoreIndicator from "./MatchScoreIndicator";
import SkillList from "./SkillList";
import ApplicantActions from "./ApplicantActions";

export default function ApplicantModal({ application, busy, error, onChangeStatus, onClose }) {
  const person = application.applicantId;
  const resume = application.resumeUrl || person?.resumeUrl || "";
  const safeResume = /^https?:\/\//i.test(resume); // never render a javascript: link

  return (
    <Modal title={person?.name || "Applicant"} onClose={onClose}>
      {error && <p className="mb-4 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="text-sm text-stone-600">
          <p>{person?.email}</p>
          {person?.phone && <p>{person.phone}</p>}
          <p className="mt-1 text-xs text-stone-500">Applied {formatDate(application.appliedAt)}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {person?.bio && <p className="mt-4 text-sm text-stone-700">{person.bio}</p>}

      <p className="mt-4 text-sm">
        {safeResume ? (
          <a href={resume} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent">
            Open resume link
          </a>
        ) : (
          <span className="text-stone-600">No resume link provided.</span>
        )}
      </p>

      <div className="mt-5"><MatchScoreIndicator score={application.matchScore} /></div>
      <div className="mt-4 space-y-3">
        <SkillList title="Matched skills" skills={application.matchedSkills} variant="matched" />
        <SkillList title="Missing skills" skills={application.missingSkills} variant="missing" />
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-stone-500">Current profile skills</p>
        {person?.skills?.length ? (
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {person.skills.map((s) => (
              <li key={s} className="border border-line px-2 py-0.5 text-xs text-stone-600">{s}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-stone-500">None listed</p>
        )}
        <p className="mt-2 text-xs text-stone-500">
          The score reflects the skills the candidate had when applying. Their profile may have changed since.
        </p>
      </div>

      <div className="mt-6 border-t border-line pt-4">
        <ApplicantActions status={application.status} busy={busy} onChange={onChangeStatus} />
      </div>
    </Modal>
  );
}
