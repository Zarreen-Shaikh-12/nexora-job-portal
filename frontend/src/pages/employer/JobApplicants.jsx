import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobApplications, updateApplicationStatus } from "../../services/applicationService";
import ApplicantCard from "../../components/ApplicantCard";
import ApplicantModal from "../../components/ApplicantModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

export default function JobApplicants() {
  const { jobId } = useParams();
  const [sort, setSort] = useState("score"); // best match first by default
  const [status, setStatus] = useState("");
  const [data, setData] = useState({ job: null, applications: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const [selectedId, setSelectedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    // Sorting and filtering are done by the server (indexed query)
    getJobApplications(jobId, { sort, status: status || undefined })
      .then((res) => active && setData({ job: res.data.job, applications: res.data.applications }))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [jobId, sort, status, attempt]);

  const changeStatus = async (application, newStatus) => {
    setActionError("");
    setUpdatingId(application._id);
    try {
      const res = await updateApplicationStatus(application._id, newStatus);
      // The response is not populated, so merge only the new status into our list
      setData((d) => ({
        ...d,
        applications: d.applications.map((a) =>
          a._id === application._id ? { ...a, status: res.data.application.status } : a
        ),
      }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Derived from the list, so the modal always shows the latest status
  const selected = data.applications.find((a) => a._id === selectedId);
  const { job, applications } = data;

  const selectClass = "border border-stone-300 bg-white px-3 py-2 text-sm";

  return (
    <div className="max-w-4xl">
      <Link to="/dashboard/employer/jobs" className="text-sm underline underline-offset-4 hover:text-accent">
        ← Back to my jobs
      </Link>

      <h1 className="mt-3 text-3xl">Applicants</h1>
      {job && <p className="mt-1 text-stone-600">{job.title}</p>}

      <div className="mt-4"><ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} /></div>

      {job && (
        <>
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-widest text-stone-500">Required skills</p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {job.requirements.map((s) => (
                <li key={s} className="border border-line px-2 py-0.5 text-xs text-stone-600">{s}</li>
              ))}
            </ul>
          </div>

          <details className="mt-4 border border-line bg-white p-4 text-sm">
            <summary className="cursor-pointer font-medium">How is the match score calculated?</summary>
            <div className="mt-3 space-y-2 text-stone-700">
              <p>
                Score = (matched skills ÷ total required skills) × 100, rounded to a whole number. This job lists{" "}
                {job.requirements.length} required {job.requirements.length === 1 ? "skill" : "skills"}, so each
                matched skill is worth about {Math.round(100 / job.requirements.length)} points.
              </p>
              <p>
                Skills are compared after lowercasing and trimming, and only exact keywords match, so
                &quot;nodejs&quot; and &quot;node.js&quot; are different. Extra skills a candidate has are not penalised.
              </p>
              <p className="text-stone-500">
                This is a skill-based estimate using the skills a candidate listed when applying. Resumes are not
                read, so it is not a full professional ATS parser. Use it to prioritise, not to decide.
              </p>
            </div>
          </details>
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="sort" className="mr-2 text-sm">Sort by</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
            <option value="score">Best match first</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="mr-2 text-sm">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="">All</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {actionError && !selected && (
        <p className="mt-4 bg-red-50 p-3 text-sm text-red-700" role="alert">{actionError}</p>
      )}

      {!loading && !error && (
        <>
          <p className="mt-4 text-sm text-stone-600">
            {applications.length} {applications.length === 1 ? "applicant" : "applicants"}
          </p>
          {applications.length === 0 ? (
            <div className="mt-4 border border-line bg-white p-8 text-center">
              <p className="font-medium">{status ? "No applicants with this status" : "No applicants yet"}</p>
              {!status && <p className="mt-1 text-sm text-stone-600">Applications will appear here as candidates apply.</p>}
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {applications.map((a, index) => (
                <ApplicantCard
                  key={a._id}
                  application={a}
                  rank={sort === "score" ? index + 1 : undefined}
                  busy={updatingId === a._id}
                  onChangeStatus={(s) => changeStatus(a, s)}
                  onReview={() => setSelectedId(a._id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {selected && (
        <ApplicantModal
          application={selected}
          busy={updatingId === selected._id}
          error={actionError}
          onChangeStatus={(s) => changeStatus(selected, s)}
          onClose={() => { setSelectedId(null); setActionError(""); }}
        />
      )}
    </div>
  );
}
