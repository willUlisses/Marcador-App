import { useEffect, useState } from "react";
import { ChevronRight, LogOut } from "lucide-react";
import MobileNav from "../components/MobileNav";
import ChangeUserDataModal from "../components/ChangeUserDataModal";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";
import { readingLogService } from "../services/readingLogService";
import { readingGoalService } from "../services/readingGoalService";
import type { UserStatsResponse } from "../schemas/user";
import type { StreakResponse } from "../schemas/readingLog";
import type { ReadingGoalResponse } from "../schemas/readingGoal";

type EditableField = "username" | "email";

const ProfilePage = () => {
    const { user, logout } = useAuth();

    // Cópia local do usuário exibido, pra refletir edições sem depender do AuthContext expor um setter.
    const [displayUser, setDisplayUser] = useState(user);

    const [userStats, setUserStats] = useState<UserStatsResponse>({
        books_read: 0,
        books_in_queue: 0,
        total_pages_read: 0,
    });
    const [streak, setStreak] = useState<StreakResponse>({
        currentStreak: 0,
        highestStreak: 0,
    });
    const [goal, setGoal] = useState<ReadingGoalResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [editingField, setEditingField] = useState<EditableField | null>(null);

    useEffect(() => {
        setDisplayUser(user);
    }, [user]);

    useEffect(() => {
        async function fetchProfileData() {
            try {
                setIsLoading(true);
                const [userStatsResponse, streakResponse] = await Promise.all([
                    userService.getUserStats(),
                    readingLogService.getReadingStreak(),
                ]);
                setUserStats(userStatsResponse);
                setStreak(streakResponse);

                try {
                    const goalResponse = await readingGoalService.getGoalProgress();
                    setGoal(goalResponse);
                } catch {
                    setGoal(null);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do perfil:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProfileData();
    }, []);

    if (!displayUser) return null;

    const initials = displayUser.username.slice(0, 2).toUpperCase();

    return (
        <div className="flex flex-col w-full min-h-screen gap-4 bg-[#fcf9f5] overflow-hidden pb-24">
            <header className="px-4 pt-8 pb-2">
                <h1 className="font-lora text-2xl font-extrabold text-stone-800">
                    Perfil
                </h1>
            </header>

            <main className="px-4 flex flex-col gap-5">
                {/* Avatar + username + e-mail + streak */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#7A3B2E] to-[#bd7a4e] flex items-center justify-center text-white text-xl font-bold shrink-0">
                        {initials}
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-lora text-xl font-bold text-stone-800">
                            {displayUser.username}
                        </span>
                        <span className="text-sm text-stone-500">
                            {displayUser.email}
                        </span>
                        {!isLoading && (
                            <span className="text-xs font-bold text-[#a34a1f] mt-0.5">
                                {streak.currentStreak} {streak.currentStreak === 1 ? "dia" : "dias"} de leitura seguidos
                            </span>
                        )}
                    </div>
                </div>

                {/* Linha de estatísticas rápidas */}
                <div className="grid grid-cols-3 border-y border-stone-400/40 py-4">
                    <div className="flex flex-col items-center gap-1 border-r border-stone-400/40">
                        <span className="text-2xl font-extrabold text-stone-800 font-lora">
                            {isLoading ? "—" : userStats.books_read}
                        </span>
                        <span className="text-[11px] font-medium text-stone-500">Lidos</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-r border-stone-400/40">
                        <span className="text-2xl font-extrabold text-stone-800 font-lora">
                            {isLoading ? "—" : streak.currentStreak}
                        </span>
                        <span className="text-[11px] font-medium text-stone-500">Dias seguidos</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl font-extrabold text-stone-800 font-lora">
                            {isLoading ? "—" : userStats.books_in_queue}
                        </span>
                        <span className="text-[11px] font-medium text-stone-500">Quero ler</span>
                    </div>
                </div>

                {/* Sua conta */}
                <div className="flex flex-col gap-1">
                    <h2 className="font-lora text-lg font-bold text-stone-800">
                        Sua conta
                    </h2>
                    <p className="text-xs text-stone-500">
                        Informações pessoais e dados de acesso.
                    </p>
                </div>

                <div className="bg-[#e6decf] border border-stone-400/50 rounded-3xl divide-y divide-stone-400/30">
                    <div className="flex justify-between items-center px-4 py-4">
                        <span className="text-sm font-semibold text-stone-700">E-mail</span>
                        <span className="text-sm text-stone-600">{displayUser.email}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setEditingField("email")}
                        className="w-full flex justify-between items-center px-4 py-4 hover:bg-[#ddd1bd] transition-colors hover:cursor-pointer"
                    >
                        <span className="text-sm font-semibold text-stone-700">Mudar e-mail</span>
                        <ChevronRight size={16} className="text-[#a34a1f]" />
                    </button>

                    <div className="flex justify-between items-center px-4 py-4">
                        <span className="text-sm font-semibold text-stone-700">Username</span>
                        <span className="text-sm text-stone-600">@{displayUser.username}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setEditingField("username")}
                        className="w-full flex justify-between items-center px-4 py-4 hover:bg-[#ddd1bd] transition-colors hover:cursor-pointer"
                    >
                        <span className="text-sm font-semibold text-stone-700">Mudar username</span>
                        <ChevronRight size={16} className="text-[#a34a1f]" />
                    </button>

                    {goal && goal.targetBooks > 0 && (
                        <div className="flex flex-col gap-2 px-4 py-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-stone-700">Meta anual</span>
                                <span className="text-sm font-bold text-[#a34a1f]">
                                    {goal.completedBooks} de {goal.targetBooks} livros
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#c9bfa9] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#804132] rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#e6decf] border border-stone-400/50 text-red-700 font-semibold rounded-2xl hover:bg-red-50 transition-colors hover:cursor-pointer"
                >
                    <LogOut size={18} />
                    Sair da conta
                </button>
            </main>

            <ChangeUserDataModal
                isOpen={editingField !== null}
                field={editingField ?? "username"}
                currentValue={editingField === "email" ? displayUser.email : displayUser.username}
                onClose={() => setEditingField(null)}
                onSuccess={(updatedUser) => {
                    setDisplayUser(updatedUser);
                    setEditingField(null);
                }}
            />

            <MobileNav />
        </div>
    );
};

export default ProfilePage;