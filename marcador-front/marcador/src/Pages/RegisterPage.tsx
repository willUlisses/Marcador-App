import { Lock, User, Bookmark, Mail } from "lucide-react"
import Input from "../components/Input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { authService } from "../services/authService"
import type { RegisterBody } from "../schemas/auth"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const registerSchema = z.object({
    email: z.string().email("O email é inválido").nonempty("O email é obrigatório"),
    username: z.string().nonempty("O usuário é obrigatório").min(3, "O usuário deve ter pelo menos 3 caracteres").max(30, "O usuário deve ter no máximo 30 caracteres"),
    password: z.string().nonempty("A senha é obrigatória").min(6, "A senha deve ter pelo menos 6 caracteres").max(30, "A senha deve ter no máximo 30 caracteres"),
    confirmPassword: z.string().nonempty("A confirmação de senha é obrigatória")
})
.refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

type RegisterSchema = z.infer<typeof registerSchema>



const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const { 
        register, 
        handleSubmit, 
        formState: { errors} } 
        = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) })

    const handleRegisterSubmit = async (data: RegisterSchema) => {
        const body: RegisterBody = {
            email: data.email,
            username: data.username,
            password: data.password
        };

        authService.register(body).then((response) => {
            console.log(response);
            login(response);
            navigate("/shelf");
        })
        .catch((error) => {
            console.log(error);
            alert("Register failed, try again");
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
                </div>
            </div>
                
            <div className="w-full sm:max-w-1/2 lg:max-w-1/3 flex flex-col bg-[#F0E8D4] rounded-3xl shadow-lg py-6 px-4 border border-stone-300 my-auto">
                <h1 className="text-xl font-extrabold mb-6 text-stone-700 font-libre tracking-wider">Cadastrar</h1>

                <form className="flex flex-col gap-3 py-2" onSubmit={handleSubmit(handleRegisterSubmit)}>
                    <Input
                        {...register("email")}
                        id="email"
                        placeholder="Email" 
                        label="EMAIL" 
                        leftIcon={<Mail className="w-4.5 h-4.5"/>} 
                        type="email" 
                        error={errors.email?.message} />

                    <Input
                        {...register("username")}
                        id="username"
                        placeholder="Usuário" 
                        label="NOME DE USUÁRIO" 
                        leftIcon={<User className="w-4.5 h-4.5"/>} 
                        type="text" 
                        error={errors.username?.message} />

                    <Input 
                        {...register("password")}
                        id="password" 
                        placeholder="●●●●●●" 
                        label="SENHA" 
                        leftIcon={<Lock className="w-4.5 h-4.5"/>}  
                        type="password" 
                        error={errors.password?.message}/>

                    <Input 
                        {...register("confirmPassword")} 
                        id="confirmPassword" 
                        placeholder="●●●●●●" 
                        label="CONFIRMAR SENHA" 
                        leftIcon={<Lock className="w-4.5 h-4.5"/>} 
                        type="password" 
                        error={errors.confirmPassword?.message}/>
            
                    <button 
                    type="submit" 
                    className="w-full mt-8 py-3 bg-linear-to-r from-[#7A3B2E] to-[#bd7a4e] text-white font-semibold rounded-2xl shadow-lg shadow-amber-950/20 transition-transform hover:scale-101 hover:cursor-pointer active:scale-99">
                        Registrar
                    </button>
                </form>
                <span className="flex flex-row gap-1 text-sm text-stone-500 self-center">
                    Já tem uma conta? <button onClick={() => navigate("/login")} className="text-[#7A3B2E] font-semibold hover:underline hover:cursor-pointer">Faça login</button>
                </span>
            </div>


        </div>
    )
}

export default RegisterPage;