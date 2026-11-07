import api from "./api";

export const sendContactMessage = (data) => api.post("/contact", data);

export const getContacts = (params) => api.get("/contact", { params });
export const updateContactStatus = (id, status) => api.patch(`/contact/${id}/status`, { status });
