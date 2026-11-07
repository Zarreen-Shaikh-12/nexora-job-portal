import api from "./api";

export const applyToJob = (data) => api.post("/applications/apply", data);
export const getMyApplications = () => api.get("/applications/my-applications");
