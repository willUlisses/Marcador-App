
export interface BookResponse {
    id : number,
    title : string,
    genres : string[],
    status : string,
    currentPage : number,
    totalPages : number | null,
    rating : number,
    opinion : string | null
}

export interface CreateBookBody {
    title: string,
    genres: string[],
    totalPages: number
}

export interface EditBookBody {
    title?: string,
    rating?: number,
    genres?: string[],
    currentPage?: number,
    totalPages?: number,
    status?: string,
    opinion?: string
}

export interface MonthlyBookCount {
    monthLabel: string;
    monthNumber: number;
    year: number;
    booksCompleted: number;
}

export interface MonthlyBooksResponse {
    currentYear: number;
    months: MonthlyBookCount[];
}

export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED' | 'DROPPED';
