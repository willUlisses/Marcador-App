import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import Input from "./Input";
import Textarea from "./Textarea";
import { reflectionService } from "../services/reflectionService";
import { bookService } from "../services/bookService";
import type { UserReflectionResponse } from "../schemas/reflection";
import type { BookResponse } from "../schemas/book";

const reflectionSchema = z.object({
    title: z.string().trim().nonempty("O título é obrigatório"),
    description: z.string().optional(),
});

type ReflectionFormInput = z.input<typeof reflectionSchema>;
type ReflectionFormOutput = z.output<typeof reflectionSchema>;

interface ReflectionModalProps {
    isOpen: boolean;
    reflection: UserReflectionResponse | null; // null = modo criação
    onClose: () => void;
    onSuccess: () => void;
}

const ANIMATION_DURATION = 300;

const ReflectionModal = ({ isOpen, reflection, onClose, onSuccess }: ReflectionModalProps) => {
    const isEditMode = !!reflection;

    const [shouldRender, setShouldRender] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ReflectionFormInput, any, ReflectionFormOutput>({
        resolver: zodResolver(reflectionSchema),
        defaultValues: { title: "", description: "" },
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                title: reflection?.title ?? "",
                description: reflection?.description ?? "",
            });
            setSelectedBookId(reflection?.bookId ?? null);
            setFormError(null);

            if (!isEditMode) {
                bookService.getAllUserBooks()
                    .then((response) => setBooks(response))
                    .catch((error) => console.error("Erro ao buscar livros:", error));
            }

            setShouldRender(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsVisible(true));
            });
        } else {
            setIsVisible(false);
            const timeout = setTimeout(() => setShouldRender(false), ANIMATION_DURATION);
            return () => clearTimeout(timeout);
        }
    }, [isOpen, reflection, reset, isEditMode]);

    const handleClose = () => {
        onClose();
    };

    const handleSaveReflection = async (data: ReflectionFormOutput) => {
        if (!isEditMode && !selectedBookId) {
            setFormError("Selecione um livro para continuar.");
            return;
        }

        try {
            setIsSubmitting(true);
            setFormError(null);

            if (isEditMode && reflection) {
                await reflectionService.patchReflection(reflection.bookId, reflection.id, {
                    title: data.title,
                    description: data.description,
                });
            } else if (selectedBookId) {
                await reflectionService.createReflection(selectedBookId, {
                    title: data.title,
                    description: data.description,
                });
            }

            onSuccess();
        } catch (error) {
            console.error("Erro ao salvar reflexão:", error);
            setFormError("Não foi possível salvar. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                className={`bg-[#fcf9f5] w-full max-w-lg rounded-t-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto transition-transform duration-300 ease-out ${
                    isVisible ? "translate-y-0" : "translate-y-full"
                }`}
            >
                <div className="sticky top-0 z-10 bg-[#fcf9f5] rounded-t-4xl px-6 pt-6 pb-4 flex flex-col gap-2">
                    <div className="w-12 h-1.5 bg-stone-300 rounded-full self-center" />

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="font-lora text-2xl font-bold text-stone-800">
                                {isEditMode ? "Editar reflexão" : "Nova reflexão"}
                            </h1>
                            <p className="text-xs text-stone-500 mt-0.5">
                                Registre com suas palavras algo que esta leitura despertou em você.
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
                    onSubmit={handleSubmit(handleSaveReflection)}
                    className="flex flex-col gap-3 px-6 pb-8"
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-widest text-stone-700">
                            LIVRO RELACIONADO
                        </label>

                        {isEditMode ? (
                            <div className="w-full bg-[#e8dfd5] border border-stone-400/50 rounded-xl py-3 px-3 text-sm text-stone-600">
                                {reflection?.bookTitle}
                            </div>
                        ) : (
                            <select
                                value={selectedBookId ?? ""}
                                onChange={(e) => setSelectedBookId(Number(e.target.value) || null)}
                                className="w-full bg-white border border-stone-400/50 rounded-xl py-3 px-3 text-sm text-stone-800 outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 transition-all"
                            >
                                <option value="" disabled>Selecione um livro</option>
                                {books.map((book) => (
                                    <option key={book.id} value={book.id}>
                                        {book.title}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <Input
                        label="TÍTULO DA REFLEXÃO"
                        className="text-sm py-3.5"
                        placeholder="Um título curto para esta ideia"
                        {...register("title")}
                        error={errors.title?.message}
                        type="text"
                    />

                    <Textarea
                        label="SUA REFLEXÃO"
                        className="text-sm"
                        placeholder="O que você absorveu, compreendeu ou quer levar desta leitura?"
                        {...register("description")}
                        error={errors.description?.message}
                        rows={5}
                    />

                    {formError && (
                        <p className="text-xs text-red-500 mt-0.5">{formError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex gap-3 items-center justify-center w-full mt-2 py-3 bg-linear-to-r from-[#4e231a] to-[#995b31] text-white font-semibold rounded-2xl transition-transform hover:scale-101 hover:cursor-pointer active:scale-99 disabled:opacity-50"
                    >
                        {isSubmitting ? "Salvando..." : "Salvar"}
                        <Check size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReflectionModal;