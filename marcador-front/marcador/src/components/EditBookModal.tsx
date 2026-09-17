import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookService } from "../services/bookService";
import type { BookResponse, EditBookBody } from "../schemas/book";
import { Check, Plus, Star, X, BookOpenCheck } from "lucide-react";
import Input from "./Input";
import Textarea from "./Textarea";
import ReadingSessionModal from "./ReadingSessionModal";

export const GENRES = {
    FANTASY: "Fantasia",
    FICTION: "Ficção",
    PHILOSOPHY: "Filosofia",
    FACTUAL: "Factual",
    FINANCE: "Finanças",
    HORROR: "Terror",
    POETRY: "Poesia",
    BIOGRAPHY: "Biografia",
    BUSINESS: "Negócios",
    ROMANCE: "Romance",
    TECHNOLOGY: "Tecnologia",
    OTHER: "Outro",
};

export const READING_STATUS = {
    WANT_TO_READ: "Quero Ler",
    READING: "Lendo",
    COMPLETED: "Concluído",
    DROPPED: "Abandonado",
};

export const statusColours: Record<keyof typeof READING_STATUS, string> = {
    WANT_TO_READ: "bg-blue-100 border border-blue-400 text-blue-900",
    READING: "bg-amber-100 border border-amber-500 text-amber-900",
    COMPLETED: "bg-green-100 border border-green-500 text-green-900",
    DROPPED: "bg-red-100 border border-red-400 text-red-900",
};

export const genreSchema = z.enum(
    Object.keys(GENRES) as [keyof typeof GENRES, ...(keyof typeof GENRES)[]]
);

export const statusSchema = z.enum(
    Object.keys(READING_STATUS) as [keyof typeof READING_STATUS, ...(keyof typeof READING_STATUS)[]]
)

export const editBookSchema = z.object({
    title: z.string().trim().nonempty("O título é obrigatório"),

    genres: z
        .array(genreSchema)
        .min(1, "Você deve escolher ao menos um gênero")
        .refine(
            (genres) => new Set(genres).size === genres.length,
            "Gêneros duplicados não são permitidos"
        ),

    rating: z.coerce.number()
        .int("A nota deve ser um número inteiro")
        .min(0, "A nota mínima é 0")
        .max(5, "A nota máxima é 5")
        .optional(),

    totalPages: z.coerce.number()
        .int("O número de páginas deve ser um número inteiro")
        .positive("O número total de páginas deve ser maior que 0"),

    status: z.array(statusSchema)
        .max(1, "Selecione apenas um status"),

    opinion: z.string().optional(),
});

type EditBookFormInput = z.input<typeof editBookSchema>;
type EditBookFormOutput = z.output<typeof editBookSchema>;


interface EditBookModalProps {
    selectedBook: BookResponse | null;
    onClose: () => void;
    onSuccess: (updatedBook: BookResponse) => void;
}

const ANIMATION_DURATION = 300;

const EditBookModal = ({ selectedBook, onClose, onSuccess }: EditBookModalProps) => {

    const [shouldRender, setShouldRender] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isGenresOpen, setIsGenresOpen] = useState<boolean>(false);
    const [isReadingSessionOpen, setIsReadingSessionOpen] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<EditBookFormInput, any, EditBookFormOutput>({
        resolver: zodResolver(editBookSchema),
        defaultValues: {
            title: "",
            genres: [],
            totalPages: 0,
            status: [],
            opinion: "",
            rating: 0,
        },
    });

    const handlePatchBook = async (data: EditBookFormOutput) => {
        if (!selectedBook) return;

        const body: EditBookBody = {
            title: data.title,
            genres: data.genres,
            totalPages: data.totalPages,
            status: data.status[0],
            rating: data.rating,
            opinion: data.opinion,
        }
        try {
            const updatedBook = await bookService.patch(body, selectedBook.id);
            reset();
            onSuccess(updatedBook);
            onClose();
        } catch (error) {
            console.error("Erro ao editar livro:", error);
        }
    }

    const selectedGenres = watch("genres");
    const selectedStatus = watch("status");
    const selectedRating = watch("rating") as number | undefined;

    const toggleGenre = (genreKey: keyof typeof GENRES) => {
        const current = selectedGenres || [];
        const updated = current.includes(genreKey)
            ? current.filter((g) => g !== genreKey)
            : [...current, genreKey];

        setValue("genres", updated, { shouldValidate: true });
    };

    const toggleStatus = (statusKey: keyof typeof READING_STATUS) => {
        const current = selectedStatus || [];
        const updated = current.includes(statusKey)
            ? []
            : [statusKey];

        setValue("status", updated, { shouldValidate: true });
    };

    const handleRatingClick = (starIndex: number) => {
        const newRating = selectedRating === starIndex ? 0 : starIndex;
        setValue("rating", newRating, { shouldValidate: true });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    useEffect(() => {
        if (selectedBook) {
            reset({
                title: selectedBook.title,
                totalPages: selectedBook.totalPages,
                genres: (selectedBook.genres ?? []).filter((g): g is keyof typeof GENRES => g in GENRES),
                status: selectedBook.status ? [selectedBook.status as keyof typeof READING_STATUS] : [],
                rating: selectedBook.rating || 0,
                opinion: selectedBook.opinion || "",
            });

            setShouldRender(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsVisible(true));
            });
        } else {
            setIsVisible(false);
            const timeout = setTimeout(() => setShouldRender(false), ANIMATION_DURATION);
            return () => clearTimeout(timeout);
        }
    }, [selectedBook]);

    const percentRead = selectedBook
        ? Math.min(100, Math.round((selectedBook.currentPage / selectedBook.totalPages) * 100))
        : 0;

    if (!shouldRender || !selectedBook) return null;

    return (
        <div
            onClick={handleClose}
            className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center py-16 transition-opacity duration-300 ease-out ${isVisible ? "opacity-100" : "opacity-0"
                }`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-[#fcf9f5] w-full max-w-lg rounded-t-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto transition-transform duration-300 ease-out ${isVisible ? "translate-y-0" : "translate-y-full"
                    }`}
            >

                <div className="sticky top-0 z-10 bg-[#fcf9f5] rounded-t-4xl px-6 pt-6 pb-4 flex flex-col gap-2">

                    <div className="w-12 h-1.5 bg-stone-300 rounded-full self-center" />

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="font-lora text-2xl font-bold text-stone-800">
                                Editar Livro
                            </h1>
                            <p className="text-xs text-stone-500 mt-0.5">
                                Edite as informações do livro
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-2 bg-[#e8dfd5] text-stone-700 rounded-full hover:bg-stone-300 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>



                <form
                    onSubmit={handleSubmit(handlePatchBook)}
                    className="flex flex-col gap-2 px-5 pb-8"
                >

                    {selectedBook.status === "READING" && (
                        <button
                            className="text-white bg-linear-to-r from-[#7A3B2E] via-[#7A3B2E] via-45% to-[#bd7a4e] border border-stone-400/50 rounded-xl py-3 hover:cursor-pointer flex items-center justify-center gap-2"
                            onClick={() => setIsReadingSessionOpen(true)}
                        >
                            <BookOpenCheck size={20} />
                            <span className="font-medium">Registrar Sessão de Leitura</span>
                        </button>
                    )}


                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-stone-500 tracking-wide">{selectedBook.currentPage} Páginas Lidas</span>
                            <span className="text-[11.5px] font-bold font-source tracking-widest text-amber-900">{percentRead}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#c9bfa9] rounded-full overflow-hidden border border-stone-300/40">
                            <div
                                className="h-full bg-[#804132] rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${percentRead}%` }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleRatingClick(starValue)}
                                        className="p-0.5 hover:cursor-pointer transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`size-6 text-amber-500 ${starValue <= (selectedRating ?? 0) ? "fill-amber-500" : ""}`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <Input
                        label="TÍTULO"
                        className="text-sm py-3.5"
                        placeholder="Nome do livro"
                        {...register("title")}
                        error={errors.title?.message}
                        type="text"
                    />

                    <Input
                        label="TOTAL DE PÁGINAS"
                        className="text-sm py-3.5"
                        placeholder="Ex: 320"
                        {...register("totalPages")}
                        error={errors.totalPages?.message}
                        type="number"
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-widest text-stone-700">GÊNERO(S)</label>
                        <div className={"flex items-center gap-1.5 flex-wrap"}>
                            {selectedGenres.map((genreKey) => {
                                const genreValue = GENRES[genreKey as keyof typeof GENRES];
                                return (
                                    <span
                                        key={genreKey}
                                        onClick={() => toggleGenre(genreKey)}
                                        className={`flex items-center gap-1 px-4 py-1.5 bg-amber-900 text-white rounded-full text-xs font-semibold hover:cursor-pointer hover:bg-amber-800 transition-colors ${isGenresOpen ? "hidden" : ""}`}
                                    >
                                        {genreValue}
                                        <X size={12} />
                                    </span>
                                );
                            })}

                            <button
                                type="button"
                                onClick={() => setIsGenresOpen(!isGenresOpen)}
                                className={`flex items-center justify-center rounded-full p-1 ${isGenresOpen ? "bg-amber-900 text-white" : "bg-[#f3f0ed] border border-stone-400/50"}`}
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className={`flex flex-wrap gap-1.5 ${isGenresOpen ? "" : "hidden"}`}>
                            {Object.entries(GENRES).map(([key, value]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => toggleGenre(key as keyof typeof GENRES)}
                                    className={`
                                        flex px-4 py-1.5 rounded-full text-xs font-semibold transition-colors items-center justify-center gap-1.5
                                        ${selectedGenres.includes(key as keyof typeof GENRES)
                                            ? "bg-amber-900 text-white shadow-sm"
                                            : "bg-[#f3f0ed] text-stone-700 hover:bg-stone-300 border border-stone-400/50"
                                        }
                                    `}
                                >
                                    {value}
                                    {selectedGenres.includes(key as keyof typeof GENRES) && (
                                        <Check className="w-3 h-3" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {errors.genres && (
                        <p className="text-xs text-red-500 mt-0.5">
                            {errors.genres.message}
                        </p>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-widest text-stone-700">STATUS</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {Object.entries(READING_STATUS).map(([key, value]) => {
                                const isSelected = selectedStatus.includes(key as keyof typeof READING_STATUS);
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => toggleStatus(key as keyof typeof READING_STATUS)}
                                        className={`
                                        px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5
                                        ${isSelected
                                                ? `${statusColours[key as keyof typeof READING_STATUS]} shadow-sm`
                                                : "bg-[#f3f0ed] text-stone-700 border border-stone-500/50 hover:bg-stone-300"
                                            }
                                    `}
                                    >
                                        {value}
                                        {isSelected && <Check className="w-3 h-3" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {errors.status && (
                        <p className="text-xs text-red-500 mt-0.5">
                            {errors.status.message}
                        </p>
                    )}

                    <Textarea
                        label="NOTA PESSOAL"
                        className="text-sm"
                        placeholder="O que você achou do livro?"
                        {...register("opinion")}
                        error={errors.opinion?.message}
                        rows={4}
                    />

                    <button
                        type="submit"
                        className="flex gap-3 items-center justify-center w-full mt-2 py-3 bg-linear-to-r from-[#4e231a] to-[#995b31] text-white font-semibold rounded-2xl transition-transform hover:scale-101 hover:cursor-pointer active:scale-99">
                        Salvar
                        <Check size={20} />
                    </button>
                </form>

                <ReadingSessionModal
                    isOpen={isReadingSessionOpen}
                    selectedBook={selectedBook}
                    onClose={() => setIsReadingSessionOpen(false)}
                    onSuccess={() => { setIsReadingSessionOpen(false) }}
                />
            </div>

        </div>
    );
};

export default EditBookModal;