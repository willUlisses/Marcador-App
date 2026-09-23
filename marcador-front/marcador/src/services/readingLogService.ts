import type { StatsResponse, WeeklyProgressResponse } from "../schemas/readingLog";
import { api } from "./api";

export const readingLogService = {
    getWeeklyProgress: () => api.get<WeeklyProgressResponse>("/reading-logs/weekly"),
    getReadingStats: () => api.get<StatsResponse>("/reading-logs/stats"),
}