import type { WeeklyProgressResponse } from "../schemas/readingLog";

interface WeeklyPagesProps {
    weeklyProgressResponse: WeeklyProgressResponse;
}

const MIN_BAR_HEIGHT_PERCENT = 6;
const LABEL_HEIGHT = 22; 

const WeeklyPages = ({ weeklyProgressResponse }: WeeklyPagesProps) => {
    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const todayName = daysOfWeek[new Date().getDay()];

    const safeDays = weeklyProgressResponse.days.map((d) => ({
        ...d,
        pagesRead: Number.isFinite(d.pagesRead) ? Math.max(0, d.pagesRead) : 0,
    }));

    const scale = (value: number) => Math.sqrt(value);

    const maxScaled = Math.max(...safeDays.map((d) => scale(d.pagesRead)), scale(1));

    const getHeightPercentage = (pagesRead: number) => {
        if (pagesRead <= 0) return 0;
        const percentage = (scale(pagesRead) / maxScaled) * 100;
        return Math.min(100, Math.max(percentage, MIN_BAR_HEIGHT_PERCENT));
    };

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

            <div className="grid grid-cols-7 h-36 border-b border-t border-stone-400/50">
                {safeDays.map((dailyReading, index) => {
                    const heightPercentage = getHeightPercentage(dailyReading.pagesRead);
                    const isToday = dailyReading.dayName === todayName;

                    return (
                        <div key={index} className="relative h-full">
                            <div
                                className="absolute bottom-0 left-0 right-0 flex items-end justify-center"
                                style={{ height: `calc(100% - ${LABEL_HEIGHT}px)` }}
                            >
                                <div
                                    className="absolute flex justify-center w-full transition-all duration-300 ease-out"
                                    style={{ bottom: `calc(${heightPercentage}% + 6px)` }}
                                >
                                    <span
                                        className={`text-xs font-bold whitespace-nowrap transition-opacity ${
                                            isToday ? "text-[#d88d37]" : "text-stone-500"
                                        } ${dailyReading.pagesRead > 0 ? "opacity-100" : "opacity-0"}`}
                                    >
                                        {dailyReading.pagesRead}
                                    </span>
                                </div>

                                <div
                                    style={{ height: `${heightPercentage}%` }}
                                    className={`w-8 rounded-sm transition-all duration-300 ease-out ${
                                        isToday ? "bg-[#d88d37]" : "bg-[#683120]"
                                    }`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-7">
                {safeDays.map((dailyReading, index) => (
                    <p
                        key={index}
                        className={`text-xs font-bold tracking-wide text-center ${
                            dailyReading.dayName === todayName ? "text-stone-900" : "text-stone-500/70"
                        }`}
                    >
                        {dailyReading.dayName}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default WeeklyPages;