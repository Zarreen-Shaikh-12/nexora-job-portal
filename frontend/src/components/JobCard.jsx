import { Link } from "react-router-dom";
import { formatDate, formatSalary } from "../utils/formatters";

export default function JobCard({ job }) {
  const company = job.employerId?.companyName || job.employerId?.name || "Company";
  const shown = job.requirements.slice(0, 4);
  const extra = job.requirements.length - shown.length;

  return (
    <article className="flex flex-col border border-line bg-white p-6 transition hover:border-stone-400">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">{job.jobType}</p>

      <h3 className="mt-2 text-xl">
        <Link to={`/jobs/${job._id}`} className="hover:text-accent">{job.title}</Link>
      </h3>
      <p className="mt-1 text-sm text-stone-600">{company} · {job.location}</p>
      <p className="mt-3 text-sm text-ink">{formatSalary(job.salaryRange)}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {shown.map((skill) => (
          <span key={skill} className="border border-line px-2 py-0.5 text-xs text-stone-600">{skill}</span>
        ))}
        {extra > 0 && <span className="px-1 text-xs text-stone-500">+{extra} more</span>}
      </div>

      <div className="mt-auto flex items-center justify-between pt-6 text-xs text-stone-500">
        <span>Posted {formatDate(job.createdAt)}</span>
        <Link to={`/jobs/${job._id}`} className="text-ink underline underline-offset-4 hover:text-accent">
          View details
        </Link>
      </div>
    </article>
  );
}
