export type UserRole = "user" | "admin" | "superAdmin";

export interface LoginPayload {
  email: string;
  password: string;
}

/** `POST /auth/login` returns tokens only; the refresh token rides an HttpOnly cookie. */
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}

/** Claims the API signs into the access token (see auth.services.ts). */
export interface Session {
  id: string;
  profileId?: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
