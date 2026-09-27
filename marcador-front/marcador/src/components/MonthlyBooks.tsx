import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { bookService } from "../services/bookService";
import type { MonthlyBooksResponse } from "../schemas/book";

const MIN_BAR_HEIGHT_PERCENT = 8;
const LABEL_RESERVED_HEIGHT = 22; 

const MonthlyBooks = () => {
    const [data, setData] = useState<MonthlyBooksResponse>({ currentYear: new Date().getFullYear(), months: [] });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchMonthlyBooks() {
            try {
                setIsLoading(true);
                const response = await bookService.getMonthlyBooksRead();
                setData(response);
            } catch (error) {
                console.error("Erro ao buscar livros por mês:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMonthlyBooks();
    }, []);

    const safeMonths = data.months.map((m) => ({
        ...m,
        booksCompleted: Number.isFinite(m.booksCompleted) ? Math.max(0, m.booksCompleted) : 0,
    }));

    const maxBooks = Math.max(...safeMonths.map((m) => m.booksCompleted), 1);

    const getHeightPercentage = (count: number) => {
        if (count <= 0) return 0;
        const percentage = (count / maxBooks) * 100;
        return Math.min(100, Math.max(percentage, MIN_BAR_HEIGHT_PERCENT));
    };

    const currentMonthIndex = safeMonths.length - 1;

    if (isLoading) {
        return (
            <div className="w-full py-18 bg-[#F0E8D4]/60 animate-pulse rounded-3xl flex items-center justify-center text-stone-950 font-medium text-md">
                Carregando livros por mês...
            </div>
        );
    }

    return (
        <div className="w-full bg-[#e6decf] border-stone-400/50 border rounded-3xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-[#d8cbb0] rounded-xl p-2">
                        <Calendar className="text-[#683120]" size={18} />
                    </div>
                    <h2 className="text-lg font-extrabold text-stone-800 font-lora">
                        Livros por Mês
                    </h2>
                </div>
                <span className="text-sm font-semibold text-stone-500">
                    {data.currentYear}
                </span>
            </div>

            <div className="grid gap-1 h-36 border-b border-t border-stone-400/50" style={{ gridTemplateColumns: `repeat(${safeMonths.length}, minmax(0, 1fr))` }}>
                {safeMonths.map((month, index) => {
                    const heightPercentage = getHeightPercentage(month.booksCompleted);
                    const isCurrentMonth = index === currentMonthIndex;

                    return (
                        <div key={`${month.year}-${month.monthNumber}`} className="relative h-full">
                            <div
                                className="absolute bottom-0 left-0 right-0 flex items-end justify-center"
                                style={{ height: `calc(100% - ${LABEL_RESERVED_HEIGHT}px)` }}
                            >
                                <div
                                    className="absolute flex justify-center w-full transition-all duration-300 ease-out"
                                    style={{ bottom: `calc(${heightPercentage}% + 6px)` }}
                                >
                                    <span
                                        className={`text-xs font-bold whitespace-nowrap transition-opacity ${
                                            isCurrentMonth ? "text-[#d88d37]" : "text-stone-500"
                                        } ${month.booksCompleted > 0 ? "opacity-100" : "opacity-0"}`}
                                    >
                                        {month.booksCompleted}
                                    </span>
                                </div>

                                <div
                                    style={{ height: `${heightPercentage}%` }}
                                    className={`w-8 rounded-sm transition-all duration-300 ease-out ${
                                        isCurrentMonth ? "bg-linear-to-t from-[#804132] to-[#d88d37]" : "bg-[#a06856]"
                                    }`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${safeMonths.length}, minmax(0, 1fr))` }}>
                {safeMonths.map((month, index) => (
                    <p
                        key={`${month.year}-${month.monthNumber}-label`}
                        className={`text-xs font-bold tracking-wide text-center ${
                            index === currentMonthIndex ? "text-stone-900" : "text-stone-500/70"
                        }`}
                    >
                        {month.monthLabel}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default MonthlyBooks;