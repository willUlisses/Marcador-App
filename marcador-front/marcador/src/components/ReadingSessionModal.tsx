import type { BookResponse, EditBookBody } from "../schemas/book";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { bookService } from "../services/bookService";
import Input from "./Input";

interface ReadingSessionProps {
    isOpen: boolean,
    selectedBook: BookResponse | null;
    onClose: () => void;
    onSuccess: (updatedBook: BookResponse) => void;
}

export const readingSessionSchema = z.object({
    currentPage: z.coerce.number()
        .int("A página deve ser um número inteiro")
        .positive("A página deve ser maior que 0")
        .optional(),
});

type ReadingSessionInput = z.input<typeof readingSessionSchema>;
type ReadingSessionOutput = z.output<typeof readingSessionSchema>;

const ANIMATION_DURATION = 300;

const ReadingSessionModal = ({ isOpen, selectedBook, onClose, onSuccess }: ReadingSessionProps) => {

    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ReadingSessionInput, any, ReadingSessionOutput>({
        resolver: zodResolver(readingSessionSchema)
    });

    const handlePatchBook = async (data: ReadingSessionOutput) => {
        if (!selectedBook) return;

        const body: EditBookBody = {
            currentPage: data.currentPage,
        }
        try {
            const updatedBook = await bookService.patch(body, selectedBook.id);
            onSuccess(updatedBook);
            onClose();
        } catch (error) {
            console.error("Erro ao editar livro:", error);
        }
    }

    const handleClose = () => {
        onClose();
    }

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

    const percentRead = selectedBook
        ? Math.min(100, Math.round((selectedBook.currentPage / selectedBook.totalPages) * 100))
        : 0;

    if (!shouldRender) return null;

    return (
            <div 
            className={`fixed inset-0 z-50 bg-black/50 backdrop-blur flex items-end justify-center transition-opacity duration-300 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}>
                <div 
                onClick={(e) => e.stopPropagation()}
                className={`bg-[#fcf9f5] w-full max-w-lg rounded-t-4xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto transition-transform duration-300 ease-out ${
                    isVisible ? "translate-y-0" : "translate-y-full"
                }`}
            >
                <div className="sticky top-0 z-10 bg-[#fcf9f5] rounded-t-4xl px-6 pt-6 pb-4 flex flex-col gap-2">

                    <div className="w-12 h-1.5 bg-stone-300 rounded-full self-center" />

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="font-lora text-2xl font-bold text-stone-800">
                                Atualizar Leitura
                            </h1>
                            <p className="text-xs text-stone-500 mt-0.5">
                                Informe a página que você está atualmente
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
                
                <div
                    className="bg-[#f0e8d3] border border-stone-400/60 p-3 mx-5 rounded-2xl flex flex-col items-center gap-1"
                >
                    <span 
                        className="font-lora font-semibold tracking-wide text-stone-800 text-lg">
                            {selectedBook.title}
                    </span>

                    <span
                        className="font-lora tracking-wide text-stone-700 text-md"
                        >
                            Você está na página <span className="font-lora font-bold tracking-wide text-stone-800">{selectedBook.currentPage}</span> de {selectedBook.totalPages}
                    </span>

                    <div className="flex justify-between items-center gap-4 w-full">
                        <div className="w-full h-2 bg-[#c9bfa9] rounded-full overflow-hidden border border-stone-300/40">
                                <div
                                    className="h-full bg-[#804132] rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${percentRead}%` }}
                                />
                        </div>

                        <span className="text-[12px] font-bold font-source tracking-widest text-amber-900">{percentRead}%</span>
                    </div>


                </div>

                <form
                    onSubmit={handleSubmit(handlePatchBook)}
                    className="flex flex-col gap-5 px-5 pb-8">

                    <Input
                        label="PÁGINA ATUAL"
                        className="text-sm py-3.5"
                        placeholder="Ex: 150"
                        defaultValue={selectedBook?.currentPage}
                        {...register("currentPage")}
                        error={errors.currentPage?.message}
                        type="number"
                    />

                    <button
                        type="submit"
                        className="flex gap-2 items-center justify-center w-full py-3 bg-linear-to-r from-[#4e231a] to-[#995b31] text-white font-semibold rounded-2xl transition-transform hover:scale-101 hover:cursor-pointer active:scale-99">
                        Salvar Sessão
                        <Check size={20} />
                    </button>
                </form>
                </div>
            </div>
        )
}

export default ReadingSessionModal;