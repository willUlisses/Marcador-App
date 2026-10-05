import { useEffect, useState } from "react";
import { Mail, X } from "lucide-react";

interface EmailVerificationModalProps {
    isOpen: boolean;
    email: string;
    onClose: () => void;
}

const ANIMATION_DURATION = 200;

const EmailVerificationModal = ({ isOpen, email, onClose }: EmailVerificationModalProps) => {
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
            onClick={onClose}
            className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center px-6 transition-opacity duration-200 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative bg-[#fcf9f5] w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-3 transition-all duration-200 ease-out ${
                    isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 bg-[#e8dfd5] text-stone-700 rounded-full hover:bg-stone-300 transition-colors hover:cursor-pointer"
                >
                    <X size={16} />
                </button>

                <div className="bg-[#f3e4d6] rounded-full p-3 w-fit">
                    <Mail className="text-[#a34a1f]" size={22} />
                </div>

                <h2 className="font-lora text-xl font-bold text-stone-800 pr-8">
                    Verifique seu e-mail
                </h2>

                <p className="text-sm text-stone-600 leading-relaxed">
                    Enviamos um link para <span className="font-bold text-stone-800">{email}</span>. Acesse o e-mail para criar uma nova senha com segurança.
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-full mt-1 py-3 bg-linear-to-r from-[#4e231a] to-[#995b31] text-white font-semibold rounded-2xl transition-transform hover:scale-101 hover:cursor-pointer active:scale-99"
                >
                    Entendi
                </button>
            </div>
        </div>
    );
};

export default EmailVerificationModal;