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
    onClick?: () => void;
}

const bookColours: string[] = ["#7A3B2E", "#5C1F2E", "#4B5A3F", "#3D3020", "#4A3D6B", "#8A7562", "#6B5D4F", "#2E4A3A"];
const bookBorderColours: string[] = ["#613029", "#401521", "#394733", "#2F241A", "#373155", "#6B5D4F", "#574E44", "#2E4A3A"]

const Book = ({ id, title, genres, status, currentPage, totalPages, rating, opinion, onClick }: BookProps) => {
    const progress = totalPages ? Math.round((currentPage / totalPages) * 100) : 0;

    return (
        <div
            onClick={onClick}
            style={{ 
                backgroundColor: bookColours[id % bookColours.length], 
                borderLeftColor: bookBorderColours[id % bookBorderColours.length] 
            }}
            className="flex flex-col hover:cursor-pointer gap-4 items-center w-28 h-44 px-2 py-3 border-l-[5px] rounded-lg shadow-lg shadow-stone-800/15">
                
            <span
                className={`flex justify-center items-center text-[10px] font-bold tracking-widest text-center ${status == "COMPLETED" ? "rounded-full bg-green-700 p-1" : "rounded-md px-2 py-1 text-center text-stone-800 bg-amber-400"}`}>
                {status === "COMPLETED" ? <Check className="text-white" size={14} strokeWidth={4} /> : getBookLabel(status)}
            </span>
            
            <div className="flex flex-col gap-2">
                <hr className="border-stone-300 w-[85%] self-center"/>

                {<div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                            key={index}
                            className={`size-3 text-yellow-400 ${index < rating ? "fill-amber-400" : ""}`}
                        />
                    ))}
                </div>}

                <hr className="border-stone-300 w-[85%] self-center"/>
            </div>

            <h2 className="line-clamp-2 text-[12px] text-white font-lora font-bold text-center tracking-wider leading-tight">{title}</h2>

            {status == "READING" && <div className="text-white text-[11px] rounded-md mt-4 w-full">
                <div className="flex justify-between items-center">
                    <span>p. {currentPage} / {totalPages}</span>
                    <span className="text-yellow-400 font-semibold">{progress}%</span>
                </div>
            </div>}
        </div>
    )
}

const getBookLabel = (status: string) => {
    switch (status) {
        case "READING":
            return "LENDO";
        case "COMPLETED":
            return "LIDO";
        case "DROPPED":
            return "PAUSADO";
        case "WANT_TO_READ":
            return "NA FILA";
    }
}

export default Book