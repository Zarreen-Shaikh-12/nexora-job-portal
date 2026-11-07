import api from "./api";

export const applyToJob = (data) => api.post("/applications/apply", data);
export const getMyApplications = () => api.get("/applications/my-applications");

export const getJobApplications = (jobId, params) => api.get(`/applications/job/${jobId}`, { params });
export const updateApplicationStatus = (id, status) => api.patch(`/applications/${id}/status`, { status });
