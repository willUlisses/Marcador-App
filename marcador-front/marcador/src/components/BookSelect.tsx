import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { BookResponse } from "../schemas/book";

interface BookSelectProps {
    books: BookResponse[];
    selectedBookId: number | null;
    onChange: (bookId: number) => void;
    error?: string;
}

const BookSelect = ({ books, selectedBookId, onChange, error }: BookSelectProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedBook = books.find((book) => book.id === selectedBookId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (bookId: number) => {
        onChange(bookId);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between bg-white border rounded-xl py-3 px-3 text-sm text-left
                    outline-none transition-all shadow-xs hover:cursor-pointer
                    ${isOpen ? "border-amber-800 ring-1 ring-amber-800" : "border-stone-400/50"}
                    ${error ? "border-red-500" : ""}
                `}
            >
                <span className={selectedBook ? "text-stone-800" : "text-stone-400"}>
                    {selectedBook ? selectedBook.title : "Selecione um livro"}
                </span>
                <ChevronDown
                    size={18}
                    className={`text-stone-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-20 mt-1.5 w-full bg-white border border-stone-400/50 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                    {books.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-stone-400">
                            Nenhum livro encontrado
                        </div>
                    ) : (
                        books.map((book) => {
                            const isSelected = book.id === selectedBookId;
                            return (
                                <button
                                    key={book.id}
                                    type="button"
                                    onClick={() => handleSelect(book.id)}
                                    className={`
                                        w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left transition-colors hover:cursor-pointer
                                        ${isSelected ? "bg-amber-50 text-amber-900 font-semibold" : "text-stone-700 hover:bg-stone-100"}
                                    `}
                                >
                                    <span className="truncate font-source">{book.title}</span>
                                    {isSelected && <Check size={14} className="text-amber-700 shrink-0" />}
                                </button>
                            );
                        })
                    )}
                </div>
            )}

            {error && (
                <span className="text-xs text-red-500 font-medium mt-1 block">
                    {error}
                </span>
            )}
        </div>
    );
};

export default BookSelect;