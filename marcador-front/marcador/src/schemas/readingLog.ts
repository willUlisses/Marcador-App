export interface DailyReadingDTO {
    dayName: string
    pagesRead: number
}

export interface WeeklyProgressResponse {
    weeklyTotalPages: number,
    days: DailyReadingDTO[]
}