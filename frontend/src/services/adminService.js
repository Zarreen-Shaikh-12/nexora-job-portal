import api from "./api";

export const getAdminStats = () => api.get("/admin/stats");
export const getAdminUsers = (params) => api.get("/admin/users", { params });
export const setUserStatus = (id, isActive) => api.patch(`/admin/users/${id}/status`, { isActive });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
