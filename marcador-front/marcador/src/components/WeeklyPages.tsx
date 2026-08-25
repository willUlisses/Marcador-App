import type { WeeklyProgressResponse } from "../schemas/readingLog";

interface WeeklyPagesProps {
    weeklyProgressResponse: WeeklyProgressResponse;
}

const WeeklyPages = ({ weeklyProgressResponse }: WeeklyPagesProps) => {
    const rawMaxPages = Math.max(
        ...weeklyProgressResponse.days.map((d) => d.pagesRead),
        1
    );

    const maxPages = rawMaxPages * 1.1;
    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const todayName = daysOfWeek[new Date().getDay()];

    return (
        <div className="w-full max-w-xl bg-[#e6decf] border-stone-400/50 border rounded-3xl p-4 flex flex-col gap-3">
            <div className="flex justify-between">
                <h2 className="text-xl font-extrabold text-stone-800 font-lora">
                    Esta semana
                </h2>
                <span className="text-sm font-bold text-[#A37322] tracking-wide">
                    {weeklyProgressResponse.weeklyTotalPages} páginas
                </span>
            </div>

            <div className="grid grid-cols-7 h-36 pt-2 border-b border-t border-stone-400/50">
                {weeklyProgressResponse.days.map((dailyReading, index) => {
                    
                    const heightPercentage = (dailyReading.pagesRead / maxPages) * 100;

                    return (
                        <div key={index} className="flex flex-col items-center justify-end">
            
                            <span
                                className={`text-xs font-bold h-5 flex items-center transition-opacity 
                                    ${dailyReading.dayName === todayName ? "text-[#d88d37]" : "text-stone-500"} ${
                                    dailyReading.pagesRead > 0 ? "opacity-100" : "opacity-0"}`}
                            >
                                {dailyReading.pagesRead}
                            </span>
                            
                            <div className="w-full flex-1 flex items-end justify-center">
                                <div
                                    style={{
                                        height: dailyReading.pagesRead > 0
                                            ? `${Math.max(heightPercentage, 6)}%`
                                            : "0%"
                                    }}
                                    className={`w-8 rounded-sm transition-all duration-300 ease-out ${
                                        dailyReading.dayName === todayName ? "bg-[#d88d37]" : "bg-[#683120]"
                                    }`}
                                />
                                </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="grid grid-cols-7">
                {weeklyProgressResponse.days.map((dailyReading, index) => (
                    <p
                        key={index}
                        className={`text-xs font-bold tracking-wide text-center ${dailyReading.dayName === todayName ? "text-stone-900" : "text-stone-500/70"}`}
                    >
                        {dailyReading.dayName}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default WeeklyPages;