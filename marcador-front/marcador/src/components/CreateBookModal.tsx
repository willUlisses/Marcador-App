import { useState, useEffect } from "react";
import { X, BookPlus, Check } from "lucide-react";
import { bookService } from "../services/bookService";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { BookResponse, CreateBookBody } from "../schemas/book";
import Input from "./Input";


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
} as const;

export const genreSchema = z.enum(
    Object.keys(GENRES) as [keyof typeof GENRES, ...(keyof typeof GENRES)[]]
);

export const createBookSchema = z.object({
    title: z.string().trim().nonempty("O título é obrigatório"),
    
    genres: z
    .array(genreSchema) 
    .min(1, "Você deve escolher ao menos um gênero")
    .refine(
        (genres) => new Set(genres).size === genres.length,
        "Gêneros duplicados não são permitidos"
    ),
    
    totalPages: z.coerce.number()
    .int("O número de páginas deve ser um número inteiro")
    .positive("O número total de páginas deve ser maior que 0"),
});

type CreateBookSchema = z.infer<typeof createBookSchema>


interface CreateBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newBook : BookResponse) => void;
}

const ANIMATION_DURATION = 300;

const CreateBookModal = ({ isOpen, onClose, onSuccess }: CreateBookModalProps) => {
    
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createBookSchema),
        defaultValues: {
            title: "",
            genres: [],
            totalPages: 0,
        },
    });

    const handleCreateBook = async (data: CreateBookSchema) => {
    
    const body: CreateBookBody = {
        title: data.title,
        genres: data.genres,
        totalPages: data.totalPages,
    }
    console.log(body)
    try {
        const newBook = await bookService.create(body);
        reset();
        onSuccess(newBook);
        onClose();
    } catch (error) {
        console.error("Erro ao criar livro:", error);
    }
    }

    const selectedGenres = watch("genres");

    const toggleGenre = (genreKey: keyof typeof GENRES) => {
        const current = selectedGenres || [];
        const updated = current.includes(genreKey)
        ? current.filter((g) => g !== genreKey)
        : [...current, genreKey];
        
        setValue("genres", updated, { shouldValidate: true });
    };
    
    const handleClose = () => {
        reset();
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsVisible(true));
            });
        } else {
            setIsVisible(false);
            const timeout = setTimeout(() => setShouldRender(false), ANIMATION_DURATION);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

     if (!shouldRender) return null;

     return (
        <div 
            onClick={handleClose}
            className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center py-16 transition-opacity duration-300 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`bg-[#fcf9f5] w-full max-w-lg rounded-t-4xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto transition-transform duration-300 ease-out ${
                    isVisible ? "translate-y-0" : "translate-y-full"
                }`}
            >
                
                <div className="w-12 h-1.5 bg-stone-300 rounded-full self-center" />

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="font-lora text-2xl font-bold text-stone-800">
                            Novo Livro
                        </h1>
                        <p className="text-xs text-stone-500 mt-0.5">
                            Adicione à sua biblioteca
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

                <form 
                    onSubmit={handleSubmit(handleCreateBook)}
                    className="flex flex-col gap-2"
                >

                    <Input      
                        label="TÍTULO *" 
                        className="text-sm py-3.5"
                        placeholder="Nome do livro" 
                        {...register("title")} 
                        error={errors.title?.message} 
                        type="text"
                    />

                    <Input      
                        label="TOTAL DE PÁGINAS *" 
                        className="text-sm py-3.5"
                        placeholder="Ex: 320" 
                        {...register("totalPages")} 
                        error={errors.totalPages?.message} 
                        type="number"
                    />

                    <div className="">
                        <label className="text-[11.5px] font-semibold font-source tracking-widest text-stone-700">GÊNERO(S) *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {Object.entries(GENRES).map(([key, value]) => (
                                <button 
                                    key={key}
                                    type="button"
                                    onClick={() => toggleGenre(key as keyof typeof GENRES)}
                                    className={`
                                    px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5
                                    ${selectedGenres.includes(key as keyof typeof GENRES)
                                        ? "bg-amber-900 text-white shadow-sm" 
                                        : "bg-[#e8dfd5] text-stone-700 hover:bg-stone-300"
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

                    <button 
                    type="submit" 
                    className="flex gap-3 items-center justify-center w-full mt-2 py-3 bg-linear-to-r from-[#7A3B2E] to-[#bd7a4e] text-white font-semibold rounded-2xl transition-transform hover:scale-101 hover:cursor-pointer active:scale-99">
                        Registrar
                        <BookPlus size={20}/>
                    </button>
                </form>

            </div>
        </div>
    );
};

export default CreateBookModal;