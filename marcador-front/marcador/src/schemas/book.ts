
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

export interface PatchBookBody {
    title?: string,
    rating?: number,
    genres?: string[],
    currentPage?: number,
    totalPages?: number,
    readingStatus?: "QUERO_LER" | "LENDO" | "COMPLETADO" | "ABANDONADO",
    opinion?: string
}

export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED' | 'DROPPED';