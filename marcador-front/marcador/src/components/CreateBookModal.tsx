import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { bookService } from "../services/bookService";
import type { ReadingStatus } from "../schemas/book";

interface CreateBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateBookModal = ({ isOpen, onClose, onSuccess }: CreateBookModalProps) => {
    const [title, setTitle] = useState("");
    const [totalPages, setTotalPages] = useState("");
    const [genres, setGenres] = useState<string[]>([]);
    const [genreInput, setGenreInput] = useState("");
    const [status, setStatus] = useState<ReadingStatus>("WANT_TO_READ");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleAddGenre = () => {
        if (genreInput.trim() && !genres.includes(genreInput.trim())) {
            setGenres([...genres, genreInput.trim()]);
            setGenreInput("");
        }
    };

    const handleRemoveGenre = (genreToRemove: string) => {
        setGenres(genres.filter((g) => g !== genreToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !totalPages) return;

        setIsSubmitting(true);
        try {
            await bookService.create({
                title: title.trim(),
                totalPages: Number(totalPages),
                genres,
                status,
                currentPage: 0,
            });

            // Reseta o formulário e notifica a página pai
            setTitle("");
            setTotalPages("");
            setGenres([]);
            setStatus("WANT_TO_READ");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Erro ao cadastrar livro:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center">
            <div className="bg-[#fcf9f5] w-full max-w-lg rounded-t-4xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                
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
                        onClick={onClose}
                        className="p-2 bg-[#e8dfd5] text-stone-700 rounded-full hover:bg-stone-300 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-extrabold tracking-wider text-[#5c1f2e]">
                            TÍTULO <span className="text-red-700">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Nome do livro"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-[#e8dfd5]/80 rounded-2xl text-stone-800 text-sm placeholder-stone-400 border border-transparent focus:border-stone-400 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-extrabold tracking-wider text-[#5c1f2e]">
                            TOTAL DE PÁGINAS <span className="text-red-700">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            placeholder="Ex: 320"
                            value={totalPages}
                            onChange={(e) => setTotalPages(e.target.value)}
                            className="w-full px-4 py-3 bg-[#e8dfd5]/80 rounded-2xl text-stone-800 text-sm placeholder-stone-400 border border-transparent focus:border-stone-400 focus:outline-none transition-all"
                        />
                    </div>

                    
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-extrabold tracking-wider text-[#5c1f2e]">
                            GÊNERO(S)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Ex: Ficção, Fantasia..."
                                value={genreInput}
                                onChange={(e) => setGenreInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddGenre();
                                    }
                                }}
                                className="w-full px-4 py-3 bg-[#e8dfd5]/80 rounded-2xl text-stone-800 text-sm placeholder-stone-400 border border-transparent focus:border-stone-400 focus:outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleAddGenre}
                                className="px-4 bg-[#e8dfd5] text-stone-700 rounded-2xl hover:bg-stone-300 transition-colors flex items-center justify-center"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {/* Chips de gêneros adicionados */}
                        {genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {genres.map((g) => (
                                    <span
                                        key={g}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/10 text-amber-950 rounded-full text-xs font-semibold"
                                    >
                                        {g}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGenre(g)}
                                            className="hover:text-red-700"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Botão Cadastrar com efeito gradiente/marrom */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#7a3b2e] to-[#5c1f2e] text-white font-bold text-sm shadow-md hover:opacity-95 transition-opacity disabled:opacity-50"
                    >
                        {isSubmitting ? "Salvando..." : "Adicionar Livro"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateBookModal;