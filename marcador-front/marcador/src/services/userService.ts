import type { User, PatchUserBody, ChangePasswordBody, UserStatsResponse } from "../schemas/user";
import { api } from "./api";

export const userService = {
    updateUser: (body: PatchUserBody) => api.patch<User>("/user/update", body),
    changePassword: (body: ChangePasswordBody) => api.patch("/user/change-password", body),
    deleteUser: (id: number) => api.delete(`/user/${id}`),
    getUserStats: () => api.get<UserStatsResponse>("/user/stats")
}