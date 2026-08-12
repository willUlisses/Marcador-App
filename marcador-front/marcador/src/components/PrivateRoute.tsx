import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"

const PrivateRoute = ({ children } : { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    
    if(isLoading){
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F8F9FB]">
                <span className="text-sm text-[#99a1af]">Carregando...</span>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    return children; 
}

export default PrivateRoute;