import type { TokenResponse } from "@/features/auth/types/auth";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthRoute = originalRequest.url?.includes("/Auth/");

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthRoute
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const email = localStorage.getItem("email");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!email || !refreshToken) {
      localStorage.clear();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    try {
      const response = await axios.post<TokenResponse>(
        `${API_URL}/Auth/refresh`,
        {
          email,
          refreshToken,
        },
      );

      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      console.error("Refresh token failed:", refreshError);

      localStorage.clear();

      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  },
);
