import { api } from "./api";
import type { BookResponse, CreateBookBody, PatchBookBody, ReadingStatus } from "../schemas/book";

export const bookService = {
    create: (body: CreateBookBody) => api.post<BookResponse>("/books", body),
    getAllUserBooks: () => api.get<BookResponse[]>("/books"),
    getAllReadingBooks: () => api.get<BookResponse[]>("/books/completed"),
    getAllCompletedBooks: () => api.get<BookResponse[]>("/books/recent"),
    getBooksByStatus: (status?: ReadingStatus) => api.get<BookResponse[]>(`/books/filter`, { params: { status } }),
    patch: (body: PatchBookBody, id: number) => api.patch<BookResponse>(`/books/${id}`, body),
    delete: (id: number) => api.delete(`/books/${id}`)
}
