import type { WeeklyProgressResponse } from "../schemas/readingLog";
import { api } from "./api";

export const readingLogService = {
    getWeeklyProgress: () => api.get<WeeklyProgressResponse>("/reading-logs/weekly")
}