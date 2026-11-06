import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getJobById } from "../services/jobService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { formatDate, formatSalary } from "../utils/formatters";

function ApplyPanel({ job }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (job.status !== "Open") {
    return <p className="rounded bg-gray-100 p-3 text-sm text-gray-700">This job is closed and no longer accepts applications.</p>;
  }
  if (!user) {
    return (
      <Link to="/login" state={{ from: location }}
        className="inline-block rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700">
        Login to apply
      </Link>
    );
  }
  if (user.role === "JobSeeker") {
    // Replaced by the real Apply flow (ApplicationModal) in Step 10
    return (
      <button disabled className="cursor-not-allowed rounded bg-blue-300 px-5 py-2 font-medium text-white">
        Apply (coming in Step 10)
      </button>
    );
  }
  return <p className="rounded bg-gray-100 p-3 text-sm text-gray-700">Only job seekers can apply to jobs.</p>;
}

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setJob(null);

    getJobById(id)
      .then((res) => active && setJob(res.data.job))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [id]);

  const employer = job?.employerId;
  // Only render a website link if it is a real http(s) URL
  const safeWebsite = employer?.companyWebsite && /^https?:\/\//i.test(employer.companyWebsite);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/jobs" className="text-sm text-blue-600 hover:underline">← Back to jobs</Link>

      {loading && <LoadingSpinner />}
      {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

      {job && (
        <article className="mt-4 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-gray-600">{employer?.companyName || employer?.name}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${
              job.status === "Open" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>
              {job.status}
            </span>
          </div>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-gray-500">Location</dt><dd className="font-medium">{job.location}</dd></div>
            <div><dt className="text-gray-500">Job type</dt><dd className="font-medium">{job.jobType}</dd></div>
            <div><dt className="text-gray-500">Salary</dt><dd className="font-medium">{formatSalary(job.salaryRange)}</dd></div>
            <div><dt className="text-gray-500">Posted</dt><dd className="font-medium">{formatDate(job.createdAt)}</dd></div>
          </dl>

          <h2 className="mt-6 text-lg font-semibold">Description</h2>
          {/* React escapes this text; whitespace-pre-line keeps the line breaks */}
          <p className="mt-1 whitespace-pre-line text-gray-700">{job.description}</p>

          <h2 className="mt-6 text-lg font-semibold">Required skills</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.requirements.map((skill) => (
              <span key={skill} className="rounded bg-blue-50 px-3 py-1 text-sm text-blue-700">{skill}</span>
            ))}
          </div>

          {employer?.companyDescription && (
            <>
              <h2 className="mt-6 text-lg font-semibold">About the company</h2>
              <p className="mt-1 text-gray-700">{employer.companyDescription}</p>
              {safeWebsite && (
                <a href={employer.companyWebsite} target="_blank" rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-blue-600 hover:underline">
                  Visit company website
                </a>
              )}
            </>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <ApplyPanel job={job} />
          </div>
        </article>
      )}
    </div>
  );
}
