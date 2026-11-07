import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { createJob, getJobById, updateJob } from "../../services/jobService";
import JobForm from "../../components/JobForm";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

export default function EmployerJobForm() {
  const { id } = useParams(); // present on the edit route, absent on post-job
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
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

  const handleSubmit = async (payload) => {
    if (isEdit) await updateJob(id, payload);
    else await createJob(payload);
    navigate("/dashboard/employer/jobs");
  };

  // UX only: the backend returns 403 for someone else's job regardless of this check
  const isOwner = job && String(job.employerId?._id) === String(user._id);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl">{isEdit ? "Edit job" : "Post a job"}</h1>

      <div className="mt-6">
        {isEdit && loading && <LoadingSpinner />}
        <ErrorMessage message={error} />
        {isEdit && job && !isOwner && (
          <p className="bg-stone-100 p-3 text-sm text-stone-700">You can only edit your own jobs.</p>
        )}
        {(!isEdit || (job && isOwner)) && (
          <JobForm key={id || "new"} initial={isEdit ? job : null} isEdit={isEdit} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
