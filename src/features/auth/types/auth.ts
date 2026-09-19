export interface UserLogin {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshRequest {
  email: string;
  refreshToken: string;
}

export interface LogoutRequest {
  email: string;
  refreshToken: string;
}
