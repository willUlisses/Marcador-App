import { useEffect, useState } from "react";
import { Target } from "lucide-react";
import { readingGoalService } from "../services/readingGoalService";
import type { ReadingGoalResponse } from "../schemas/readingGoal";
import ReadingGoalModal from "./ReadingGoalModal";

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ReadingGoal = () => {
    const [goal, setGoal] = useState<ReadingGoalResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const fetchGoal = async () => {
        try {
            setIsLoading(true);
            const response = await readingGoalService.getGoalProgress();
            setGoal(response);
        } catch (error) {
            // Assumindo que erro aqui = usuário ainda não definiu meta (404).
            // Se seu wrapper distinguir status, trate especificamente o 404 aqui.
            setGoal(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGoal();
    }, []);

    const clampedPercentage = goal ? Math.min(100, Math.round(goal.progressPercentage)) : 0;
    const remainingBooks = goal ? Math.max(0, goal.targetBooks - goal.completedBooks) : 0;
    const strokeDashoffset = CIRCUMFERENCE - (clampedPercentage / 100) * CIRCUMFERENCE;

    if (isLoading) {
        return (
            <div className="w-full py-14 bg-[#F0E8D4]/60 animate-pulse rounded-3xl flex items-center justify-center text-stone-950 font-medium text-md">
                Carregando meta...
            </div>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full text-left bg-linear-to-br from-[#4e231a] to-[#a9744a] rounded-3xl p-5 shadow-lg shadow-stone-800/15 transition-transform hover:scale-[1.01] hover:cursor-pointer"
            >
                {goal ? (
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] font-bold text-white/70 tracking-widest">
                                META ANUAL DE LEITURA
                            </span>

                            <p className="font-lora text-white leading-none">
                                <span className="text-3xl font-extrabold">{goal.completedBooks}</span>
                                <span className="text-sm font-medium text-white/80"> de {goal.targetBooks} livros</span>
                            </p>

                            <div className="w-40 h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${clampedPercentage}%` }}
                                />
                            </div>

                            <span className="text-xs text-white/70 font-medium">
                                {goal.isCompleted
                                    ? "Meta concluída! Parabéns 🎉"
                                    : `${remainingBooks} ${remainingBooks === 1 ? "livro restante" : "livros restantes"} para a meta`}
                            </span>
                        </div>

                        <div className="relative shrink-0 w-16 h-16">
                            <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                                <circle cx="32" cy="32" r={RADIUS} stroke="rgba(255,255,255,0.25)" strokeWidth="6" fill="none" />
                                <circle
                                    cx="32" cy="32" r={RADIUS}
                                    stroke="white" strokeWidth="6" fill="none"
                                    strokeDasharray={CIRCUMFERENCE}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-500 ease-out"
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                                {clampedPercentage}%
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="bg-white/15 rounded-2xl p-3">
                            <Target className="text-white" size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white font-lora">
                                Você ainda não tem uma meta de leitura
                            </span>
                            <span className="text-xs text-white/70 mt-0.5">
                                Toque aqui para definir quantos livros quer ler este ano
                            </span>
                        </div>
                    </div>
                )}
            </button>

            <ReadingGoalModal
                isOpen={isModalOpen}
                currentGoal={goal}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(updatedGoal) => {
                    setGoal(updatedGoal);
                    setIsModalOpen(false);
                }}
                onDelete={() => {
                    setGoal(null);
                    setIsModalOpen(false);
                }}
            />
        </>
    );
};

export default ReadingGoal;