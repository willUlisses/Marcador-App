import type { CreateGoalBody, ReadingGoalResponse } from "../schemas/readingGoal";
import { api } from "./api";

const currentYear = new Date().getFullYear();

export const readingGoalService = {
    

    getGoalProgress: () => api.get<ReadingGoalResponse>("/goals"),
    upsertGoal: (body: CreateGoalBody) => api.put<ReadingGoalResponse>(`/goals/${currentYear}`, body),
    deleteGoal: () => api.delete(`/goals/${currentYear}`)
}