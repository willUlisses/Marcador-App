import MobileNav from "../components/MobileNav"
import { useAuth } from "../contexts/AuthContext"
import ReadingNow from "../components/ReadingNow"
import { useEffect, useState } from "react"
import type { BookResponse } from "../schemas/book"
import { bookService } from "../services/bookService"

const ShelfPage = () => {
    const { user } = useAuth()

    const [books, setBooks] = useState<BookResponse[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {

        async function fetchReadingNowBooks() {
            try {
                setIsLoading(true);

                const response = await bookService.getAllCompletedBooks()
                setBooks(response)
            } catch (error) {
                console.error("Erro ao buscar livros em leitura:", error)
            } finally {
                setIsLoading(false);
            }
        }

        fetchReadingNowBooks();
    }, [])

    return (
        <div className="flex flex-col w-full min-h-screen p-4 gap-10 bg-[#fcf9f5]">
            <header>
                <p className="text-sm font-bold text-stone-500 tracking-wide">Olá,</p>
                <h1 className="text-3xl font-lora font-bold tracking-wider">{user.username}</h1>
            </header>

            <main>
                <h1 className="font-lora text-xl tracking-wide mb-3">Lendo Agora</h1>
                {isLoading && (
                    <div className="w-full max-w-xl py-18 bg-[#F0E8D4]/60 animate-pulse rounded-3xl flex items-center justify-center text-stone-950 font-medium text-md">
                        Carregando leituras...
                    </div>
                )}
                
                {!isLoading && <ReadingNow books={books}  />}
                <br />
                <div>div com gráfico da quantidade de páginas lidas na semana (em cada dia e total)</div>
            </main>
            <MobileNav />
        </div>
    )
}

export default ShelfPage