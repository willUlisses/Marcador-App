import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import Input from "./Input";
import { userService } from "../services/userService";
import type { User } from "../schemas/user";

type EditableField = "username" | "email";

const FIELD_CONFIG: Record<EditableField, {
    title: string;
    description: string;
    label: string;
    placeholder: string;
    schema: z.ZodString;
}> = {
    username: {
        title: "Mudar username",
        description: "Escolha como seu nome de usuário será exibido no Marcador.",
        label: "NOVO USERNAME",
        placeholder: "seu_username",
        schema: z.string()
            .trim()
            .min(3, "O username deve ter ao menos 3 caracteres")
            .max(30, "O username deve ter no máximo 30 caracteres")
            .regex(/^[a-zA-Z0-9_]+$/, "Use apenas letras, números e underscore"),
    },
    email: {
        title: "Mudar e-mail",
        description: "Esse e-mail será usado para login e recuperação de conta.",
        label: "NOVO E-MAIL",
        placeholder: "seu@email.com",
        schema: z.string()
            .trim()
            .nonempty("O e-mail é obrigatório")
            .email("Informe um e-mail válido"),
    },
};

interface ChangeUserDataModalProps {
    isOpen: boolean;
    field: EditableField;
    currentValue: string;
    onClose: () => void;
    onSuccess: (updatedUser: User) => void;
}

const ANIMATION_DURATION = 300;

const ChangeUserDataModal = ({ isOpen, field, currentValue, onClose, onSuccess }: ChangeUserDataModalProps) => {
    const [shouldRender, setShouldRender] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);

    const config = FIELD_CONFIG[field];

    const fieldSchema = z.object({ value: config.schema });
    type FieldFormInput = z.input<typeof fieldSchema>;
    type FieldFormOutput = z.output<typeof fieldSchema>;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FieldFormInput, any, FieldFormOutput>({
        resolver: zodResolver(fieldSchema),
        defaultValues: { value: "" },
    });

    useEffect(() => {
        if (isOpen) {
            reset({ value: field === "username" ? currentValue.replace(/^@/, "") : currentValue });
            setFormError(null);

            setShouldRender(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsVisible(true));
            });
        } else {
            setIsVisible(false);
            const timeout = setTimeout(() => setShouldRender(false), ANIMATION_DURATION);
            return () => clearTimeout(timeout);
        }
    }, [isOpen, field, currentValue, reset]);

    const handleClose = () => {
        onClose();
    };

    const handleSave = async (data: FieldFormOutput) => {
        try {
            setIsSubmitting(true);
            setFormError(null);

            const body = field === "username"
                ? { username: data.value }
                : { email: data.value };

            const updatedUser = await userService.updateUser(body);
            onSuccess(updatedUser);
        } catch (error) {
            console.error(`Erro ao atualizar ${field}:`, error);
            setFormError(
                field === "username"
                    ? "Esse username já está em uso ou é inválido."
                    : "Esse e-mail já está em uso ou é inválido."
            );
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
                                {config.title}
                            </h1>
                            <p className="text-xs text-stone-500 mt-0.5">
                                {config.description}
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
                    onSubmit={handleSubmit(handleSave)}
                    className="flex flex-col gap-3 px-6 pb-8"
                >
                    <Input
                        label={config.label}
                        className="text-sm py-3.5"
                        placeholder={config.placeholder}
                        leftIcon={field === "username" ? <span className="text-stone-500">@</span> : undefined}
                        {...register("value")}
                        error={errors.value?.message}
                        type="text"
                        autoFocus
                    />

                    {formError && (
                        <p className="text-xs text-red-500 mt-0.5">{formError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex gap-3 items-center justify-center w-full mt-2 py-3 bg-linear-to-r from-[#4e231a] to-[#995b31] text-white font-semibold rounded-2xl transition-transform hover:scale-101 hover:cursor-pointer active:scale-99 disabled:opacity-50"
                    >
                        {isSubmitting ? "Salvando..." : `Salvar ${field === "username" ? "username" : "e-mail"}`}
                        <Check size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangeUserDataModal;