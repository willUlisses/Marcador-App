import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteReflectionModalProps {
    isOpen: boolean;
    reflectionTitle: string;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ANIMATION_DURATION = 200;

const DeleteReflectionModal = ({
    isOpen,
    reflectionTitle,
    isDeleting,
    onCancel,
    onConfirm,
}: DeleteReflectionModalProps) => {
    const [shouldRender, setShouldRender] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);

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
            onClick={onCancel}
            className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center px-6 transition-opacity duration-200 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-[#fcf9f5] w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-3 text-center transition-all duration-200 ease-out ${
                    isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
            >
                <div className="bg-red-100 rounded-full p-3">
                    <Trash2 className="text-red-500" size={24} />
                </div>

                <h2 className="font-lora text-xl font-bold text-stone-800">
                    Apagar reflexão?
                </h2>

                <p className="text-sm text-stone-500">
                    <span className="italic">"{reflectionTitle}"</span> será removida permanentemente.
                </p>

                <div className="flex gap-3 w-full mt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 bg-[#e8dfd5] text-stone-700 font-semibold rounded-2xl hover:bg-stone-300 transition-colors hover:cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition-colors hover:cursor-pointer disabled:opacity-50"
                    >
                        {isDeleting ? "Apagando..." : "Apagar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteReflectionModal;