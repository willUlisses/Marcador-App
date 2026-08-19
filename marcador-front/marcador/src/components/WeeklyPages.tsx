import type { WeeklyProgressResponse } from "../schemas/readingLog";

interface WeeklyPagesProps {
    weeklyProgressResponse: WeeklyProgressResponse
}

const WeeklyPages = ({ weeklyProgressResponse }: WeeklyPagesProps) => {
    return (
        <div className="w-full max-w-xl bg-[#e6decf] border border-stone-300/70 rounded-3xl px-4 py-16 text-center text-stone-600 font-lora">
            <h2>Total de páginas lidas nesta semana: {weeklyProgressResponse.weeklyTotalPages}</h2>
            <div className="flex">
                {weeklyProgressResponse.days.map((dailyReading, index) => (
                    <div key={index} className="flex flex-col items-center gap-4">
                        <p className="text-sm font-bold text-stone-500 tracking-wide">{dailyReading.dayName}</p>
                        <p className="text-sm font-bold text-stone-500 tracking-wide">{dailyReading.pagesRead}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WeeklyPages;