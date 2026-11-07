import { useCallback, useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";

export function useMyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getMyApplications()
      .then((res) => active && setApplications(res.data.applications))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((a) => a + 1), []);
  return { applications, loading, error, reload };
}
