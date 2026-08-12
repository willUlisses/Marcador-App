import MobileNav from "../components/MobileNav"
import { useAuth } from "../contexts/AuthContext"

const ShelfPage = () => {
    const { user } = useAuth()

    return (
        <div className="flex flex-col w-full min-h-screen p-4 gap-4 bg-[#fcf6ec]">
            <header>
                <p className="text-black text-md font-source">Olá,</p>
                <h1 className="text-black text-3xl font-lora font-bold tracking-wider">{user.username}</h1>
            </header>

            <main>
                <h1 className="font-lora text-xl tracking-wide">Lendo Agora</h1>
                <div className="">div com dados do livro em leitura atual.</div>
                <br />
                <div>div com gráfico da quantidade de páginas lidas na semana (em cada dia e total)</div>
            </main>
            <MobileNav />
        </div>
    )
}

export default ShelfPage