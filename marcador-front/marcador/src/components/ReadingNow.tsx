import { useCallback, useState } from "react"
import type { BookResponse } from "../schemas/book"
import { ChevronLeft, ChevronRight } from "lucide-react";
import Book from "../components/Book";


const ReadingNow = ({ books }: { books: BookResponse[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const hasMultipleBooks : boolean = books.length > 1;

    const handleNext = useCallback(() => {
        if (!hasMultipleBooks) return;
        
        setCurrentIndex(prevIndex => (prevIndex + 1) % books.length )
    }, [books.length, hasMultipleBooks])

    const handlePrevious = useCallback(() => {
        if (!hasMultipleBooks) return;
        
        setCurrentIndex(prevIndex => (prevIndex - 1 + books.length) % books.length )
    }, [books.length, hasMultipleBooks])

    if (!books || books.length === 0) {
        return (
            <div className="w-full max-w-xl bg-[#e6decf] border border-stone-300/70 rounded-3xl px-4 py-16 text-center text-stone-600 font-lora">
                <h1 className="text-xl font-lora">Você não tem nenhum livro em leitura no momento</h1>
            </div>
        );
    }

    const currentBook = books[currentIndex];
    const percentRead = Math.min(100, Math.round((currentBook.currentPage / currentBook.totalPages) * 100));

    return (
        <div
            aria-label="Carrossel de livros em leitura"
            className="relative w-full max-w-xl bg-[#e6decf] border-stone-400/50 border rounded-3xl p-4 shadow-xs flex items-center justify-between gap-2 outline-none focus:ring-2 focus:ring-amber-800/20"
        >
            <button 
                aria-label="Livro anterior" 
                onClick={handlePrevious} 
                disabled={!hasMultipleBooks} 
                className="text-stone-600 disabled:opacity-30 transition hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/30 rounded-full">
                <ChevronLeft aria-hidden="true" size={16} strokeWidth={3} />
            </button>
            
            <div 
                key={currentBook.id} 
                className="flex-1 flex items-center gap-6 overflow-hidden animate-in fade-in duration-300"
            >

            <Book
                id={currentBook.id}
                title={currentBook.title}
                genres={currentBook.genres}
                status={currentBook.status}
                currentPage={currentBook.currentPage}
                totalPages={currentBook.totalPages}
                rating={currentBook.rating}
                opinion={currentBook.opinion} />
            
            <div className="flex-1 flex flex-col gap-2 min-w-0">
                <span className="text-[12px] font-bold tracking-widest text-[#A37322]">
                EM LEITURA
                </span>

                <h2 className="text-lg font-bold font-serif text-stone-900 leading-snug truncate">
                {currentBook.title}
                </h2>

                <div className="mt-2 flex items-center justify-between text-xs font-semibold text-stone-600">
                <span>
                    p. {currentBook.currentPage} / {currentBook.totalPages || "?"}
                </span>
                <span className="font-bold text-[#A37322] text-sm">{percentRead}%</span>
                </div>

                <div className="w-full h-2.5 bg-[#c9bfa9] rounded-full overflow-hidden border border-stone-300/40">
                <div
                    className="h-full bg-[#c78649] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentRead}%` }}
                />
                </div>
            </div>
            </div>

            <button 
                aria-label="Próximo livro" 
                onClick={handleNext} 
                disabled={!hasMultipleBooks} 
                className="text-stone-600 disabled:opacity-30 transition hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/30 rounded-full">
                <ChevronRight aria-hidden="true" size={16} strokeWidth={3} />
            </button>
            
        </div>
    )
}

export default ReadingNow;