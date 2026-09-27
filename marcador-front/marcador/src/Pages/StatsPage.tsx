import { useEffect, useState } from "react";
import { BookOpenCheck, Library, Clock, Activity } from "lucide-react";
import MobileNav from "../components/MobileNav";
import { readingLogService } from "../services/readingLogService";
import { userService } from "../services/userService";
import type { StatsResponse, StreakResponse } from "../schemas/readingLog";
import type { UserStatsResponse } from "../schemas/user";
import ReadingGoal from "../components/ReadingGoal";

const StatsPage = () => {
    const [stats, setStats] = useState<StatsResponse>({
        pagesReadThisMonth: 0,
        mostReadGenre: null,
        averagePagesPerDay: 0,
        totalPagesRead: 0,
    });
    const [streak, setStreak] = useState<StreakResponse>({
        currentStreak: 0,
        highestStreak: 0,
    });
    const [userStats, setUserStats] = useState<UserStatsResponse>({
        books_read: 0,
        books_in_queue: 0,
        total_pages_read: 0,
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchAllStats() {
            try {
                setIsLoading(true);
                const [statsResponse, streakResponse, userStatsResponse] = await Promise.all([
                    readingLogService.getReadingStats(),
                    readingLogService.getReadingStreak(),
                    userService.getUserStats(),
                ]);
                setStats(statsResponse);
                setStreak(streakResponse);
                setUserStats(userStatsResponse);
            } catch (error) {
                console.error("Erro ao buscar estatísticas:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAllStats();
    }, []);

    return (
        <div className="flex flex-col w-full min-h-screen gap-4 bg-[#fcf9f5] overflow-hidden pb-24">
            <header className="px-4 pt-8 pb-2">
                <h1 className="font-lora text-3xl font-extrabold text-stone-800">
                    Estatísticas
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                    Seu progresso como leitor
                </p>
            </header>

            <main className="px-4 flex flex-col gap-4">
                <ReadingGoal />

                {isLoading ? (
                    <div className="w-full py-18 bg-[#F0E8D4]/60 animate-pulse rounded-3xl flex items-center justify-center text-stone-950 font-medium text-md">
                        Carregando estatísticas...
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#e6decf] border border-stone-400/50 rounded-3xl p-4 flex flex-col gap-3">
                                <div className="bg-[#d8cbb0] rounded-xl p-2.5 w-fit">
                                    <BookOpenCheck className="text-[#683120]" size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-lora leading-none">
                                        <span className="text-3xl font-extrabold text-stone-800">{userStats.books_read}</span>
                                        <span className="text-sm font-semibold text-stone-500"> livros</span>
                                    </p>
                                    <span className="text-xs font-medium text-stone-500 mt-1">
                                        Lidos no total
                                    </span>
                                </div>
                            </div>

                            <div className="bg-[#e6decf] border border-stone-400/50 rounded-3xl p-4 flex flex-col gap-3">
                                <div className="bg-[#d8cbb0] rounded-xl p-2.5 w-fit">
                                    <Library className="text-[#683120]" size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-lora leading-none">
                                        <span className="text-3xl font-extrabold text-stone-800">
                                            {stats.totalPagesRead.toLocaleString("pt-BR")}
                                        </span>
                                        <span className="text-sm font-semibold text-stone-500"> páginas</span>
                                    </p>
                                    <span className="text-xs font-medium text-stone-500 mt-1">
                                        Total lidas
                                    </span>
                                </div>
                            </div>

                            <div className="bg-[#e6decf] border border-stone-400/50 rounded-3xl p-4 flex items-center gap-4 col-span-2">
                                <div className="bg-[#d8cbb0] rounded-xl p-2.5 shrink-0">
                                    <Clock className="text-[#683120]" size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-lora leading-none">
                                        <span className="text-3xl font-extrabold text-stone-800">
                                            {stats.averagePagesPerDay.toFixed(0)}
                                        </span>
                                        <span className="text-sm font-semibold text-stone-500"> páginas/dia</span>
                                    </p>
                                    <span className="text-xs font-medium text-stone-500 mt-1">
                                        Média diária de leitura
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#e6decf] border border-stone-400/50 rounded-3xl p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Activity className="text-[#683120]" size={18} />
                                <h2 className="font-lora font-bold text-stone-800">
                                    Sequência de Leitura
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[#d8cbb0]/60 rounded-2xl p-3 flex flex-col items-center text-center">
                                    <span className="text-2xl font-extrabold text-[#a34a1f] font-lora">
                                        {streak.currentStreak}
                                    </span>
                                    <span className="text-[10px] font-bold text-stone-600 tracking-wide">DIAS</span>
                                    <span className="text-[11px] font-medium text-stone-500 mt-1">
                                        Sequência atual
                                    </span>
                                </div>

                                <div className="bg-[#d8cbb0]/60 rounded-2xl p-3 flex flex-col items-center text-center">
                                    <span className="text-2xl font-extrabold text-stone-800 font-lora">
                                        {streak.highestStreak}
                                    </span>
                                    <span className="text-[10px] font-bold text-stone-600 tracking-wide">DIAS</span>
                                    <span className="text-[11px] font-medium text-stone-500 mt-1">
                                        Maior sequência
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <MobileNav />
        </div>
    );
};

export default StatsPage;