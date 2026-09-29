import type {
    BookWithReflectionsResponse,
    CreateReflectionBody,
    PatchReflectionBody,
    ReflectionResponse,
    UserReflectionResponse,
} from "../schemas/reflection";
import { api } from "./api";

export const reflectionService = {
    getAllUserReflections: () => api.get<UserReflectionResponse[]>("/reflections"),
    getBookReflections: (bookId: number) => api.get<ReflectionResponse[]>(`/reflections/${bookId}`),
    createReflection: (bookId: number, body: CreateReflectionBody) => api.post<BookWithReflectionsResponse>(`/reflections/${bookId}`, body),
    patchReflection: (bookId: number, reflectionId: number, body: PatchReflectionBody) => api.patch<BookWithReflectionsResponse>(`/reflections/${bookId}/${reflectionId}`, body),
    deleteReflection: (bookId: number, reflectionId: number) => api.delete(`/reflections/${bookId}/${reflectionId}`),
};