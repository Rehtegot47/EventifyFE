import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("eventify_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isOnAuthPage = window.location.pathname === "/login" || window.location.pathname === "/register";
      if (!isOnAuthPage) {
        localStorage.removeItem("eventify_token");
        localStorage.removeItem("eventify_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
