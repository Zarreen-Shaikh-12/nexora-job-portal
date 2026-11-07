import { useCallback, useEffect, useState } from "react";
import { getMyJobs } from "../services/jobService";

export function useMyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getMyJobs()
      .then((res) => active && setJobs(res.data.jobs))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((a) => a + 1), []);
  // setJobs is exposed so pages can update the list locally after close/delete
  return { jobs, setJobs, loading, error, reload };
}
