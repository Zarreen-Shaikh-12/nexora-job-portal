import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatters";
import StatusBadge from "./StatusBadge";
import MatchScoreIndicator from "./MatchScoreIndicator";
import SkillList from "./SkillList";

export default function ApplicationCard({ application }) {
  const job = application.jobId; // populated by the backend (null only if the job vanished)
  const company = job?.employerId?.companyName || job?.employerId?.name;

  return (
    <article className="border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg">
            {job ? (
              <Link to={`/jobs/${job._id}`} className="hover:text-accent">{job.title}</Link>
            ) : (
              "Job no longer available"
            )}
          </h3>
          {job && <p className="mt-1 text-sm text-stone-600">{[company, job.location].filter(Boolean).join(" · ")}</p>}
          <p className="mt-1 text-xs text-stone-500">Applied {formatDate(application.appliedAt)}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="mt-4 max-w-xs">
        <MatchScoreIndicator score={application.matchScore} />
      </div>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-stone-600 hover:text-ink">Skill breakdown</summary>
        <div className="mt-3 space-y-3">
          <SkillList title="Matched skills" skills={application.matchedSkills} variant="matched" />
          <SkillList title="Missing skills" skills={application.missingSkills} variant="missing" />
        </div>
      </details>
    </article>
  );
}
