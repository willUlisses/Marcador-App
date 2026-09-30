import { Pencil, Trash2, Star } from "lucide-react";
import type { UserReflectionResponse } from "../schemas/reflection";

interface ReflectionCardProps {
    reflection: UserReflectionResponse;
    onEdit: () => void;
    onDelete: () => void;
}

const ReflectionCard = ({ reflection, onEdit, onDelete }: ReflectionCardProps) => {
    const rating = reflection.bookRating ?? 0;

    return (
        <div className="bg-[#e6decf] border border-stone-400/50 rounded-3xl p-5 flex flex-col gap-3">
            <div className="flex justify-between items-start gap-3">
                <h3 className="font-lora text-lg font-bold text-stone-800 leading-tight">
                    {reflection.title}
                </h3>

                <div className="flex gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="p-2 bg-[#d8cbb0] text-stone-700 rounded-full hover:bg-stone-300 transition-colors hover:cursor-pointer"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors hover:cursor-pointer"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {reflection.description && (
                <p className="text-sm text-stone-700 leading-relaxed line-clamp-4">
                    {reflection.description}
                </p>
            )}

            <hr className="border-stone-400/40" />

            <div className="flex justify-between items-center gap-2">
                <span className="text-xs font-bold text-stone-600 truncate">
                    {reflection.bookTitle}
                </span>

                {reflection.bookRating !== null && (
                    <div className="flex items-center gap-1 shrink-0">
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                    key={index}
                                    className={`size-3.5 text-amber-500 ${index < rating ? "fill-amber-500" : ""}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-amber-700">{rating}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReflectionCard;