
export interface BookResponse {
    id : number,
    title : string,
    genres : string[],
    readingStatus : string,
    currentPage : number,
    totalPages : number | null,
    rating : number | null,
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