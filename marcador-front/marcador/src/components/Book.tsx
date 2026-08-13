import { Star, Check } from "lucide-react"

interface BookProps {
    id: number;
    title: string;
    genres: string[];
    status: string;
    currentPage: number;
    totalPages: number;
    rating: number;
    opinion: string;
}

const Book = ({ id, title, genres, status, currentPage, totalPages, rating, opinion }: BookProps) => {
    return (
        <div
            className="flex flex-col justify-evenly items-center w-28 h-46 bg-amber-900 px-2 border-l-2 border-amber-950 rounded-md">
            <span
                className={`text-[12px] font-lora text-center ${status == "COMPLETADO" ? "rounded-full bg-green-700 p-1" : "bg-amber-400 rounded-md px-2 text-center"}`}>
                {status === "COMPLETADO" ? <Check className="text-white" size={14} strokeWidth={4} /> : status.replace("_", " ")}
            </span>

            <div className="flex flex-col gap-2">
                <hr className="border-stone-300 w-[70%] self-center"/>

                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                            key={index}
                            className={`size-3.5 ${index < rating ? "fill-amber-400 text-yellow-400" : "text-yellow-400"}`}
                        />
                    ))}
                </div>

                <hr className="border-stone-300 w-[70%] self-center"/>
            </div>

            <h2 className="line-clamp text-white font-lora font-bold text-md text-center">{title}</h2>

            <span className="text-white text-sm font-source text-center bg-[#1a1a18a6] rounded-md p-1">
                {currentPage} / {totalPages}
            </span>
        </div>
    )
}

export default Book