import axios from "axios";
import type { LogoutRequest, TokenResponse, UserLogin } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials: UserLogin): Promise<TokenResponse> => {
  const response = await axios.post<TokenResponse>(
    `${API_URL}/Auth/login`,
    credentials,
  );

  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken);
  localStorage.setItem("email", credentials.email);
  return response.data;
};

export const logout = async (data: LogoutRequest): Promise<void> => {
  await axios.post(`${API_URL}/Auth/logout`, data);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("email");
};
