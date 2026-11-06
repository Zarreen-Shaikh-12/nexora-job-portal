import { Link } from "react-router-dom";
import { formatDate, formatSalary } from "../utils/formatters";

const typeStyles = {
  "Full-time": "bg-green-100 text-green-800",
  "Part-time": "bg-yellow-100 text-yellow-800",
  Remote: "bg-purple-100 text-purple-800",
};

export default function JobCard({ job }) {
  const company = job.employerId?.companyName || job.employerId?.name || "Company";
  const shown = job.requirements.slice(0, 4);
  const extra = job.requirements.length - shown.length;

  return (
    <article className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            <Link to={`/jobs/${job._id}`} className="hover:text-blue-600">{job.title}</Link>
          </h3>
          <p className="text-sm text-gray-600">{company}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyles[job.jobType] || ""}`}>
          {job.jobType}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600">📍 {job.location}</p>
      <p className="text-sm text-gray-600">💰 {formatSalary(job.salaryRange)}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {shown.map((skill) => (
          <span key={skill} className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{skill}</span>
        ))}
        {extra > 0 && <span className="px-1 text-xs text-gray-500">+{extra} more</span>}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-500">
        <span>Posted {formatDate(job.createdAt)}</span>
        <Link to={`/jobs/${job._id}`} className="font-medium text-blue-600 hover:underline">View details</Link>
      </div>
    </article>
  );
}
