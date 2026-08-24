import type { WeeklyProgressResponse } from "../schemas/readingLog";

interface WeeklyPagesProps {
    weeklyProgressResponse: WeeklyProgressResponse;
}

const WeeklyPages = ({ weeklyProgressResponse }: WeeklyPagesProps) => {
    const maxPages = Math.max(
        ...weeklyProgressResponse.days.map((d) => d.pagesRead),
        1
    );

    return (
        <div className="w-full max-w-xl bg-[#e6decf] border-stone-400/50 border rounded-3xl p-4 flex flex-col gap-3">
            <div className="flex justify-between">
                <h2 className="text-2xl font-extrabold text-stone-800 font-lora">
                    Esta semana
                </h2>
                <span className="text-sm font-bold text-[#A37322] tracking-wide">
                    {weeklyProgressResponse.weeklyTotalPages} páginas
                </span>
            </div>

            <div className="grid grid-cols-7 h-32 pt-4 border-b border-t border-stone-400/50">
                {weeklyProgressResponse.days.map((dailyReading, index) => {
                    
                    const heightPercentage = (dailyReading.pagesRead / maxPages) * 100;
                    const isHighlight = dailyReading.dayName === "Qui";

                    return (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-end h-full gap-1">
                            
                            <span
                                className={`text-xs font-bold transition-opacity ${isHighlight ? "text-[#d88d37]" : "text-stone-500"}`}
                            >
                                {dailyReading.pagesRead}
                            </span>
                            
                            <div
                                style={{ height: `${heightPercentage}%` }}
                                className={`w-8 rounded-sm transition-all duration-300 ease-out ${
                                    isHighlight ? "bg-[#d88d37]" : "bg-[#683120]"
                                }`}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="grid grid-cols-7">
                {weeklyProgressResponse.days.map((dailyReading, index) => (
                    <p
                        key={index}
                        className={`text-xs font-bold tracking-wide text-center ${dailyReading.dayName === "Qui" ? "text-stone-900" : "text-stone-500/70"}`}
                    >
                        {dailyReading.dayName}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default WeeklyPages;