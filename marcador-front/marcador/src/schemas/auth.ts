import type { User } from "./user";

export interface AuthResponse {
    token: string;
    user: User;
}

export interface RegisterBody {
    email: string;
    username: string;
    password: string;
}

export interface LoginBody {
    username: string;
    password: string;
}

export interface ResetPasswordBody {
    token: string,
    newPassword: string
}