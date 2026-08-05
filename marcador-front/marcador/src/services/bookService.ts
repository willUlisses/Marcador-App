import { api } from "./api";
import type { BookResponse, CreateBookBody, PatchBookBody } from "../types/book";

export const bookService = {
    create: (body: CreateBookBody) => api.post<BookResponse>("/books", body),
    getAllUserBooks: () => api.get<BookResponse[]>("/books"),
    patch: (body: PatchBookBody, id: number) => api.patch<BookResponse>(`/books/${id}`, body),
    delete: (id: number) => api.delete(`/books/${id}`)
}
