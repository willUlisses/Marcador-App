import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Trash2, X } from "lucide-react";
import Input from "./Input";
import { readingGoalService } from "../services/readingGoalService";
import type { ReadingGoalResponse } from "../schemas/readingGoal";

const goalSchema = z.object({
    targetBooks: z.coerce.number()
        .int("A meta deve ser um número inteiro")
        .positive("A meta deve ser maior que 0"),
});

type GoalFormInput = z.input<typeof goalSchema>;
type GoalFormOutput = z.output<typeof goalSchema>;

interface ReadingGoalModalProps {
    isOpen: boolean;
    currentGoal: ReadingGoalResponse | null;
    onClose: () => void;
    onSuccess: (updatedGoal: ReadingGoalResponse) => void;
    onDelete: () => void;
}

const ANIMATION_DURATION = 300;

const ReadingGoalModal = ({ isOpen, currentGoal, onClose, onSuccess, onDelete }: ReadingGoalModalProps) => {
    const [shouldRender, setShouldRender] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<GoalFormInput, any, GoalFormOutput>({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            targetBooks: 12,
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                targetBooks: currentGoal?.targetBooks ?? 12,
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
    }, [isOpen, currentGoal, reset]);

    const handleClose = () => {
        onClose();
    };

    const handleSaveGoal = async (data: GoalFormOutput) => {
        try {
            const updatedGoal = await readingGoalService.upsertGoal({ targetBooks: data.targetBooks });
            onSuccess(updatedGoal);
        } catch (error) {
            console.error("Erro ao salvar meta:", error);
        }
    };

    const handleDeleteGoal = async () => {
        try {
            setIsDeleting(true);
            await readingGoalService.deleteGoal();
            onDelete();
        } catch (error) {
            console.error("Erro ao remover meta:", error);
        } finally {
            setIsDeleting(false);
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
                                Meta de Leitura
                            </h1>
                            <p className="text-xs text-stone-500 mt-0.5">
                                Defina quantos livros você quer ler este ano
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
                    onSubmit={handleSubmit(handleSaveGoal)}
                    className="flex flex-col gap-3 px-6 pb-8"
                >
                    <Input
                        label="LIVROS POR ANO"
                        className="text-sm py-3.5"
                        placeholder="Ex: 20"
                        {...register("targetBooks")}
                        error={errors.targetBooks?.message}
                        type="number"
                    />

                    <button
                        type="submit"
                        className="flex gap-3 items-center justify-center w-full mt-2 py-3 bg-linear-to-r from-[#4e231a] to-[#995b31] text-white font-semibold rounded-2xl transition-transform hover:scale-101 hover:cursor-pointer active:scale-99"
                    >
                        Salvar
                        <Check size={20} />
                    </button>

                    {currentGoal && (
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={handleDeleteGoal}
                            className="flex gap-2 items-center justify-center w-full py-3 text-red-600 font-semibold rounded-2xl border border-red-200 hover:bg-red-50 transition-colors hover:cursor-pointer disabled:opacity-50"
                        >
                            <Trash2 size={18} />
                            {isDeleting ? "Removendo..." : "Remover meta"}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ReadingGoalModal;