import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // send and receive the HTTP-only auth cookie
  headers: { "Content-Type": "application/json" },
});

// AuthContext registers a function here to run when the session has expired
let unauthorizedHandler = null;
export const setUnauthorizedHandler = (fn) => {
  unauthorizedHandler = fn;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // 401 on a normal API call means the session expired or is invalid.
    // /auth/* calls are excluded: a 401 there is expected (wrong password, not logged in yet).
    if (status === 401 && !url.startsWith("/auth/") && unauthorizedHandler) {
      unauthorizedHandler();
    }

    // Give every error a readable message for the UI
    error.message =
      error.response?.data?.message ||
      (error.request ? "Cannot reach the server. Please try again." : error.message);

    return Promise.reject(error);
  }
);

export default api;
