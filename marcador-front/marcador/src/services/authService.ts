import type { AuthResponse, LoginBody, RegisterBody, ResetPasswordBody } from "../schemas/auth";
import type { User } from "../schemas/user";
import { api } from "./api";

export const authService = {
    register: (body: RegisterBody) => api.post<AuthResponse>("/auth/register", body, { auth: false }),
    login: (body: LoginBody) => api.post<AuthResponse>("/auth/login", body, { auth: false }),
    me: () => api.get<User>("/auth/me"),
    forgotPassword: (body: { email: string }) => api.post("/auth/forgot-password", body),
    resetPassword: (body: ResetPasswordBody) => api.post("/auth/reset-password", body)
}