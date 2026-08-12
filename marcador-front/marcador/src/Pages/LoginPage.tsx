import { Lock, User, Bookmark } from "lucide-react"
import Input from "../components/Input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { authService } from "../services/authService"
import type { LoginBody } from "../schemas/auth"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const loginSchema = z.object({
    username: z.string().nonempty("O usuário é obrigatório"),
    password: z.string().nonempty("A senha é obrigatória")
})

type LoginSchema = z.infer<typeof loginSchema>

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const { 
        register, 
        handleSubmit, 
        formState: { errors} } 
        = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) })

    const handleLoginSubmit = async (data: LoginSchema) => {
        const body: LoginBody = {
            username: data.username,
            password: data.password
        };

        authService.login(body).then((response) => {
            console.log(response);
            login(response);
            navigate("/shelf");
        })
        .catch((error) => {
            console.log(error);
            alert("Login failed, try again");
        })
    }

    return (
        <div className="flex flex-col w-full min-h-screen items-center bg-amber-50 px-4 py-24 gap-4">

            <div className="flex flex-col gap-3 items-center">
                <div className="bg-[#7A3B2E] shadow-2xl p-4 rounded-2xl w-fit">
                    <Bookmark className="w-8 h-8 text-white"/>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl text-stone-700 font-extrabold font-libre">Marcador</h1>
                    <p className="text-stone-500 font-medium">Seu diário de leitura pessoal</p>
                </div>
            </div>

                
            <div className="w-full sm:max-w-1/2 lg:max-w-1/3 flex flex-col bg-[#F0E8D4] rounded-3xl shadow-lg py-6 px-4 border border-stone-300 my-auto">
                <h1 className="text-xl font-extrabold mb-6 text-stone-700 font-libre tracking-wider">Entrar</h1>

                <form className="flex flex-col gap-3 py-2" onSubmit={handleSubmit(handleLoginSubmit)}>
                    <div className="flex flex-col gap-1">
                        <Input
                            {...register("username")}
                            id="username"
                            placeholder="Usuário" 
                            label="NOME DE USUÁRIO" 
                            leftIcon={<User className="w-5 h-5"/>} 
                            type="text" 
                            error={errors.username?.message} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Input 
                            {...register("password")}
                            id="password" 
                            placeholder="●●●●●●" 
                            label="SENHA" 
                            leftIcon={<Lock className="w-5 h-5"/>}  
                            type="password" 
                            error={errors.password?.message}/>
                    </div>
            
                    <button 
                    type="submit" 
                    className="w-full mt-8 py-3 bg-linear-to-r from-[#7A3B2E] to-[#bd7a4e] text-white font-semibold rounded-2xl shadow-lg shadow-amber-950/20 transition-transform hover:scale-101 hover:cursor-pointer active:scale-99">
                        Entrar
                    </button>
                </form>
                <span className="flex flex-row gap-1 text-sm text-stone-500 self-center">
                    Não tem uma conta? <button onClick={() => navigate("/register")} className="text-[#7A3B2E] font-semibold hover:underline hover:cursor-pointer">Registre-se</button>
                </span>
            </div>


        </div>
    )
}

export default LoginPage