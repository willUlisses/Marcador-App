import { Trash2 } from "lucide-react";

const DeleteBookModal = () => {
    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
            <div className="flex flex-col gap-2 bg-[#fcf9f5] w-[320px] p-6 rounded-2xl shadow-xl border text-center border-stone-300/40">
                <div className="self-center bg-[#e3d7cf] p-3 rounded-full text-[#5c1f2e]">
                    <Trash2 size={20} />
                </div>
                
                <h1 className="font-lora text-xl font-bold text-stone-800">Apagar da biblioteca?</h1>

                <p className="text-sm text-stone-500">Você tem certeza que deseja apagar este livro?</p>

                <div className="flex justify-between gap-2">
                    <button 
                        className="px-4 py-3 rounded-lg w-full bg-[#f5f0ec] border border-stone-400/50 text-stone-800 font-semibold text-sm hover:cursor-pointer">
                        Cancelar
                    </button>
                    
                    <button 
                        className="px-4 py-3 rounded-lg w-full bg-[#5c1f2e] text-white font-semibold text-sm hover:cursor-pointer">
                        Apagar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteBookModal;