import MobileNav from "../components/MobileNav"
import { useAuth } from "../contexts/AuthContext"
import ReadingNow from "../components/ReadingNow"
import { useEffect, useState } from "react"
import type { BookResponse } from "../schemas/book"
import { bookService } from "../services/bookService"
import WeeklyPages from "../components/WeeklyPages"
import { readingLogService } from "../services/readingLogService"
import type { WeeklyProgressResponse } from "../schemas/readingLog"
import UserHeader from "../components/UserHeader"
import type { UserStatsResponse } from "../schemas/user"
import { userService } from "../services/userService"

const ShelfPage = () => {
    const { user } = useAuth()

    const [books, setBooks] = useState<BookResponse[]>([])
    const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgressResponse>({
        weeklyTotalPages: 0,
        days: []
    }) 
    const [userStats, setUserStats] = useState<UserStatsResponse>({
        books_read: 0,
        books_in_queue: 0,
        total_pages_read: 0
    })
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

        async function fetchWeeklyPagesData() {
            await readingLogService.getWeeklyProgress()
            .then(response => {
                setWeeklyProgress(response);
                console.log(response)});
        }

        async function fetchUserStats() {
            await userService.getUserStats()
            .then(response => {
                setUserStats(response);
            })
        }

        fetchReadingNowBooks();
        fetchWeeklyPagesData();
        fetchUserStats();
    }, [])

    return (
        <div className="flex flex-col w-full min-h-screen gap-4 bg-[#fcf9f5] overflow-hidden">
            <UserHeader 
            username={user.username}
            booksRead={userStats.books_read}
            booksInQueue={userStats.books_in_queue}
            totalPagesRead={userStats.total_pages_read}
            />

            <main className="p-4">
                <h1 className="font-lora text-2xl mb-3 font-extrabold">Lendo Agora</h1>
                {isLoading && (
                    <div className="w-full max-w-xl py-18 bg-[#F0E8D4]/60 animate-pulse rounded-3xl flex items-center justify-center text-stone-950 font-medium text-md">
                        Carregando leituras...
                    </div>
                )}
                
                {!isLoading && <ReadingNow books={books}  />}
                <br />
                <WeeklyPages weeklyProgressResponse={weeklyProgress} />
            </main>
            <MobileNav />
        </div>
    )
}

export default ShelfPage