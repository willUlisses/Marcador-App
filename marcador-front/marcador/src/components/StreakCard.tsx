import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { readingLogService } from "../services/readingLogService";

const StreakCard = () => {
    const [streak, setStreak] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchStreak() {
            try {
                setIsLoading(true);
                const response = await readingLogService.getReadingStats();
                setStreak(response.currentStreak);
            } catch (error) {
                console.error("Erro ao buscar sequência de leitura:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStreak();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full py-14 bg-[#F0E8D4]/60 animate-pulse rounded-3xl" />
        );
    }

    return (
        <div className="w-full bg-linear-to-r from-[#7A3B2E] to-[#bd7a4e] rounded-3xl p-5 flex items-center gap-4 shadow-lg shadow-stone-800/10">
            <div className="bg-white/15 rounded-2xl p-3 flex items-center justify-center">
                <Flame className="text-white" size={28} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-white font-lora leading-tight">
                    {streak} {streak === 1 ? "dia" : "dias"}
                </span>
                <span className="text-xs font-semibold text-white/80 tracking-wide">
                    {streak > 0
                        ? "de leitura seguidos"
                        : "comece a ler hoje pra iniciar sua sequência"}
                </span>
            </div>
        </div>
    );
};

export default StreakCard;