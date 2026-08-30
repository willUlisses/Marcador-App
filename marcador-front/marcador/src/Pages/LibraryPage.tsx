import { useEffect, useState } from "react";
import MobileNav from "../components/MobileNav";
import { bookService } from "../services/bookService";
import type { BookResponse, ReadingStatus } from "../schemas/book";
import Book from "../components/Book";

const filterOptions = [
    { label: "Todos", value: "" },
    { label: "Lendo", value: "READING" },
    { label: "Lidos", value: "COMPLETED" },
    { label: "Abandonados", value: "DROPPED" },
    { label: "Quero Ler", value: "WANT_TO_READ" }
] as const;

const LibraryPage = () => {
    const [selectedFilter, setSelectedFilter] = useState<ReadingStatus | "">("");
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchBooks() {
            setIsLoading(true);
            try {
                const statusParam = selectedFilter !== "" ? selectedFilter : undefined;
                const data = await bookService.getBooksByStatus(statusParam);
                setBooks(data);
            } catch (error) {
                console.error("Erro ao carregar livros:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBooks();
    }, [selectedFilter]);

    return (
        <div className="flex flex-col w-full min-h-screen gap-2 px-4 pt-4 bg-[#fcf9f5] overflow-hidden pb-24">
            <h1 className="font-lora text-2xl font-extrabold text-stone-800">Minha Biblioteca</h1>

            <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1">
                {filterOptions.map((filterOption) => (
                    <button
                        key={filterOption.value}
                        type="button"
                        onClick={() => setSelectedFilter(filterOption.value as ReadingStatus | "")}
                        className={`flex items-center justify-center transition-colors shrink-0 snap-start px-3 py-2 rounded-full border border-stone-400/50 text-xs font-semibold ${
                            selectedFilter === filterOption.value
                                ? "bg-amber-950 text-white"
                                : "bg-[#d3cabf] text-stone-800"
                        }`}
                    >
                        {filterOption.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex justify-center pt-8">
                    <p className="text-sm font-medium text-stone-500">Carregando livros...</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 justify-items-center gap-2 pt-2 w-full">
                    {books.length === 0 ? (
                        <p className="text-sm col-span-3 text-stone-500 text-center pt-8">
                            Nenhum livro encontrado nesta categoria.
                        </p>
                    ) : (
                        books.map((book) => (
                                <Book
                                    key={book.id}
                                    id={book.id}
                                    title={book.title}
                                    genres={book.genres}
                                    status={book.status}
                                    currentPage={book.currentPage}
                                    totalPages={book.totalPages}
                                    rating={book.rating}
                                    opinion={book.opinion} />
                        ))
                    )}
                </div>
            )}

            <MobileNav />
        </div>
    );
};

export default LibraryPage;