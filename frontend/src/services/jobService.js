import api from "./api";

export const getJobs = (params) => api.get("/jobs", { params });
export const getJobById = (id) => api.get(`/jobs/${id}`);
