export interface DailyReadingDTO {
    dayName: string
    pagesRead: number
}

export interface WeeklyProgressResponse {
    weeklyTotalPages: number,
    days: DailyReadingDTO[]
}

export interface StatsResponse {
    pagesReadThisMonth: number,
    mostReadGenre: string | null,
    averagePagesPerDay: number,
    currentStreak: number
}