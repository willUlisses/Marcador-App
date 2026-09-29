export interface ReflectionResponse {
    id: number;
    title: string;
    description: string;
}

export interface UserReflectionResponse {
    id: number;
    title: string;
    description: string;
    bookId: number;
    bookTitle: string;
    bookRating: number | null;
}

export interface BookWithReflectionsResponse {
    id: number;
    title: string;
    genres: string[];
    status: string;
    currentPage: number;
    totalPages: number;
    rating: number | null;
    opinion: string | null;
    reflections: ReflectionResponse[];
}

export interface CreateReflectionBody {
    title: string;
    description?: string;
}

export interface PatchReflectionBody {
    title?: string;
    description?: string;
}