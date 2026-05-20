import axios from "axios";
import { clearAuth } from "./auth";

// Lấy baseURL từ env - Vite sẽ replace process.env trong build time
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Xử lý 401 - Token hết hạn hoặc không hợp lệ
    if (err?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("API 401 Unauthorized:", err?.config?.url);

      try {
        // Thử refresh token nếu có
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${baseURL}/api/auth/refresh`, {
            refreshToken,
          });

          const newToken = response.data?.token;
          if (newToken) {
            setAuthToken(newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
      }

      // Nếu refresh thất bại, xóa auth và redirect
      clearAuth();
      window.dispatchEvent(
        new CustomEvent("app:unauthorized", {
          detail: {
            message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          },
        }),
      );

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(err);
  },
);

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
}
