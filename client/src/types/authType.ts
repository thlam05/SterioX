import type { UserResponse } from "./userType";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
};

export type TokenResponse = {
  accessToken: string;
  tokenType: string;
};

export type LoginResponse = {
  token: string;
  user: UserResponse
};

export type IntrospectResponse = {
  valid: boolean;
}