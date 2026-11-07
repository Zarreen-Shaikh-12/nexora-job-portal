import { formatDate } from "../utils/formatters";
import StatusBadge from "./StatusBadge";
import MatchScoreIndicator from "./MatchScoreIndicator";
import SkillList from "./SkillList";
import ApplicantActions from "./ApplicantActions";

export default function ApplicantCard({ application, rank, busy, onChangeStatus, onReview }) {
  const person = application.applicantId; // populated by the backend

  return (
    <article className="border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg">
            {rank && <span className="mr-2 text-sm text-stone-500">#{rank}</span>}
            {person?.name || "Deleted user"}
          </h3>
          <p className="mt-1 text-sm text-stone-600">{person?.email}</p>
          <p className="mt-1 text-xs text-stone-500">Applied {formatDate(application.appliedAt)}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <MatchScoreIndicator score={application.matchScore} />
        <SkillList title="Matched skills" skills={application.matchedSkills} variant="matched" />
        <SkillList title="Missing skills" skills={application.missingSkills} variant="missing" />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <ApplicantActions status={application.status} busy={busy} onChange={onChangeStatus} />
        <button type="button" onClick={onReview} className="text-sm underline underline-offset-4 hover:text-accent">
          Review profile
        </button>
      </div>
    </article>
  );
}
