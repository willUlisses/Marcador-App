
export interface BookWithReflectionsResponse {
    id : number,
    title : string,
    genres : string[],
    readingStatus : string,
    currentPage: number | null,
    totalPages: number,
    rating: number | null,
    opinion: string | null,
    reflections: ReflectionsResponse[]
}

export interface ReflectionsResponse {
    id: number,
    title: string,
    description: string | null 
}

export interface CreateReflectionBody {
    title: string,
    description?: string
}

export interface PatchReflectionBody {
    title?: string,
    description?: string 
}



