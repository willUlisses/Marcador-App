export interface ReadingGoalResponse {
    year: number,
    targetBooks: number,
    completedBooks: number,
    progressPercentage: number,
    isCompleted: boolean
}

export interface CreateGoalBody {
    targetBooks: number,
}

