import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { User } from "../types/user";
import type { AuthResponse } from "../types/auth"
import { authService } from "../services/authService";

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    login: (data: AuthResponse) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({children} : {children : ReactNode}) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("marcador.token")

        if (!token) { 
            setIsLoading(false);
            return
        }

        authService.me().then(response => { setUser(response) }) 
        .catch(() => {
            localStorage.removeItem("marcador.token");
            setUser(null);
        })
        .finally(() => setIsLoading(false))
    }, [])

    const login = (data : AuthResponse) => {
        localStorage.setItem("marcador.token", data.token);
        setUser({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role
        });
    }

    const logout = () => {
        localStorage.removeItem("marcador.token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, isLoading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
  return useContext(AuthContext);
}