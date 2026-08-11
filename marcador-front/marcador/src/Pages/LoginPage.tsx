import { Lock, User, Bookmark } from "lucide-react"
import Input from "../components/Input"

const LoginPage = () => {

    return (
        <div className="flex flex-col w-full h-full items-center bg-amber-50 px-4 py-24">

            <div className="flex flex-col gap-3 items-center">
                <div className="bg-[#7A3B2E] shadow-2xl p-4 rounded-2xl w-fit">
                    <Bookmark className="w-8 h-8 text-white"/>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl text-[#7A3B2E] font-bold">Marcador</h1>
                    <p className="text-stone-500 font-medium">Seu diário de leitura pessoal</p>
                </div>
            </div>

                
            <div className="w-full bg-[#F0E8D4] rounded-2xl shadow-lg py-6 px-4 border border-stone-300 my-auto">
                <h1 className="text-xl font-bold mb-4">Login</h1>

                <form className="flex flex-col gap-2 py-2">
                    <div className="flex flex-col gap-1">
                        <Input
                        id="username" 
                        placeholder="Usuário" 
                        label="Usuário" 
                        leftIcon={<User className="w-5 h-5"/>} 
                        type="text" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Input 
                            id="password" 
                            placeholder="●●●●●●" 
                            label="Senha" 
                            leftIcon={<Lock className="w-5 h-5"/>}  
                            type="password" />
                    </div>
            
                    <button 
                    type="submit" 
                    className="w-full mt-8 py-3 bg-linear-to-r from-[#7A3B2E] to-[#bd7a4e] text-white font-semibold rounded-2xl shadow-lg shadow-amber-950/20 transition-transform hover:scale-101 hover:cursor-pointer active:scale-99">
                        Entrar
                    </button>
                </form>
            </div>

        </div>
    )
}

export default LoginPage