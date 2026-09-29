import { useEffect, useState } from "react";
import { Plus, NotebookPen } from "lucide-react";
import MobileNav from "../components/MobileNav";
import ReflectionCard from "../components/ReflectionCard";
import ReflectionModal from "../components/ReflectionModal";
import DeleteReflectionModal from "../components/DeleteReflectionModal";
import { reflectionService } from "../services/reflectionService";
import type { UserReflectionResponse } from "../schemas/reflection";

const ReflectionsPage = () => {
    const [reflections, setReflections] = useState<UserReflectionResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingReflection, setEditingReflection] = useState<UserReflectionResponse | null>(null);

    const [reflectionToDelete, setReflectionToDelete] = useState<UserReflectionResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const fetchReflections = async () => {
        try {
            setIsLoading(true);
            const response = await reflectionService.getAllUserReflections();
            setReflections(response);
        } catch (error) {
            console.error("Erro ao buscar reflexões:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReflections();
    }, []);

    const handleOpenCreate = () => {
        setEditingReflection(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (reflection: UserReflectionResponse) => {
        setEditingReflection(reflection);
        setIsModalOpen(true);
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        setEditingReflection(null);
        fetchReflections();
    };

    const handleConfirmDelete = async () => {
        if (!reflectionToDelete) return;

        try {
            setIsDeleting(true);
            await reflectionService.deleteReflection(reflectionToDelete.bookId, reflectionToDelete.id);
            setReflectionToDelete(null);
            fetchReflections();
        } catch (error) {
            console.error("Erro ao apagar reflexão:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen gap-4 bg-[#fcf9f5] overflow-hidden pb-24">
            <header className="px-4 pt-8 pb-2 flex justify-between items-start">
                <div>
                    <h1 className="font-lora text-2xl font-extrabold text-stone-800">
                        Reflexões
                    </h1>
                    <p className="text-xs text-stone-500 mt-0.5">
                        Ideias que ficaram com você
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="p-3 bg-[#7A3B2E] text-white rounded-full shadow-lg shadow-stone-800/15 hover:bg-[#5f2d22] transition-colors hover:cursor-pointer"
                >
                    <Plus size={20} />
                </button>
            </header>

            <main className="px-4 flex flex-col gap-4">
                <div className="bg-[#e6decf] border border-stone-400/50 rounded-2xl p-4 flex items-center gap-3">
                    <NotebookPen className="text-[#683120] shrink-0" size={20} />
                    <p className="text-xs text-stone-600 leading-relaxed">
                        Este é o seu caderno de leitura: escreva interpretações, aprendizados e mudanças que cada livro provocou.
                    </p>
                </div>

                {isLoading ? (
                    <div className="w-full py-18 bg-[#F0E8D4]/60 animate-pulse rounded-3xl flex items-center justify-center text-stone-950 font-medium text-md">
                        Carregando reflexões...
                    </div>
                ) : reflections.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {reflections.map((reflection) => (
                            <ReflectionCard
                                key={reflection.id}
                                reflection={reflection}
                                onEdit={() => handleOpenEdit(reflection)}
                                onDelete={() => setReflectionToDelete(reflection)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="w-full bg-[#e6decf] border border-stone-400/50 rounded-3xl px-4 py-16 text-center text-stone-600">
                        <h1 className="text-lg font-lora">Você ainda não escreveu nenhuma reflexão</h1>
                    </div>
                )}
            </main>

            <ReflectionModal
                isOpen={isModalOpen}
                reflection={editingReflection}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
            />

            <DeleteReflectionModal
                isOpen={!!reflectionToDelete}
                reflectionTitle={reflectionToDelete?.title ?? ""}
                isDeleting={isDeleting}
                onCancel={() => setReflectionToDelete(null)}
                onConfirm={handleConfirmDelete}
            />

            <MobileNav />
        </div>
    );
};

export default ReflectionsPage;