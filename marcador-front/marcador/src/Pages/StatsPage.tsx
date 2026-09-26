import { useEffect, useState } from "react";
import { Flame, BookOpen, Gauge, Tags } from "lucide-react";
import MobileNav from "../components/MobileNav";
import { readingLogService } from "../services/readingLogService";
import type { StatsResponse } from "../schemas/readingLog";
import { GENRES } from "../components/EditBookModal";
import ReadingGoal from "../components/ReadingGoal";

const StatsPage = () => {
    const [stats, setStats] = useState<StatsResponse>({
        pagesReadThisMonth: 0,
        mostReadGenre: null,
        averagePagesPerDay: 0,
        currentStreak: 0,
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                setIsLoading(true);
                const response = await readingLogService.getReadingStats();
                setStats(response);
            } catch (error) {
                console.error("Erro ao buscar estatísticas:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, []);

    const genreLabel = stats.mostReadGenre
        ? GENRES[stats.mostReadGenre as keyof typeof GENRES]
        : null;

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
                        <div className="w-full bg-linear-to-r from-[#7A3B2E] to-[#bd7a4e] rounded-3xl p-5 flex items-center gap-4 shadow-lg shadow-stone-800/10">
                            <div className="bg-white/15 rounded-2xl p-3 flex items-center justify-center">
                                <Flame className="text-white" size={28} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-extrabold text-white font-lora leading-tight">
                                    {stats.currentStreak} {stats.currentStreak === 1 ? "dia" : "dias"}
                                </span>
                                <span className="text-xs font-semibold text-white/80 tracking-wide">
                                    {stats.currentStreak > 0
                                        ? "de leitura seguidos"
                                        : "comece a ler hoje pra iniciar sua sequência"}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#e6decf] border border-stone-400/50 rounded-3xl p-4 flex flex-col gap-2">
                                <div className="bg-[#d8cbb0] rounded-full p-2 w-fit">
                                    <BookOpen className="text-[#683120]" size={18} />
                                </div>
                                <span className="text-2xl font-extrabold text-stone-800 font-lora">
                                    {stats.pagesReadThisMonth}
                                </span>
                                <span className="text-[11px] font-bold text-stone-500 tracking-wide leading-tight">
                                    páginas lidas este mês
                                </span>
                            </div>

                            <div className="bg-[#e6decf] border border-stone-400/50 rounded-3xl p-4 flex flex-col gap-2">
                                <div className="bg-[#d8cbb0] rounded-full p-2 w-fit">
                                    <Gauge className="text-[#683120]" size={18} />
                                </div>
                                <span className="text-2xl font-extrabold text-stone-800 font-lora">
                                    {stats.averagePagesPerDay.toFixed(1)}
                                </span>
                                <span className="text-[11px] font-bold text-stone-500 tracking-wide leading-tight">
                                    páginas por dia (média)
                                </span>
                            </div>

                            <div className="bg-[#e6decf] border border-stone-400/50 rounded-3xl p-4 flex flex-col gap-2 col-span-2">
                                <div className="bg-[#d8cbb0] rounded-full p-2 w-fit">
                                    <Tags className="text-[#683120]" size={18} />
                                </div>
                                {genreLabel ? (
                                    <span className="text-2xl font-extrabold text-stone-800 font-lora">
                                        {genreLabel}
                                    </span>
                                ) : (
                                    <span className="text-sm font-semibold text-stone-500">
                                        Sem dados suficientes ainda
                                    </span>
                                )}
                                <span className="text-[11px] font-bold text-stone-500 tracking-wide leading-tight">
                                    gênero mais lido
                                </span>
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