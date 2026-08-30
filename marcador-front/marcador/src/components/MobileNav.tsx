import { Book, ChartNoAxesColumnIncreasing, Home, MessageSquare, User } from "lucide-react"
import { useLocation, Link } from "react-router-dom"

const MobileNav = () => {
    const location = useLocation();

    const navItems = [
        {
            icon: Home,
            label: "Estante",
            path: "/"
        },
        {
            icon: Book,
            label: "Biblioteca",
            path: "/library"
        },
        {
            icon: ChartNoAxesColumnIncreasing,
            label: "Métricas",
            path: "/stats"
        },
        {
            icon: MessageSquare,
            label: "Reflexões",
            path: "/reflections"
        },
        {
            icon: User,
            label: "Perfil",
            path: "/profile"
        }
    ]

    return (
        <div className="w-full py-2 px-4 fixed bottom-0 left-0 right-0 z-50 bg-[#fcf9f5]">
            <nav className="bg-[#f1ebe0] px-4 py-1 shadow-lg rounded-full border-stone-400/50 border">
                <div className="flex items-center">
                    {navItems.map((item) => {
                        
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path

                        return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`${isActive ? "bg-amber-950 rounded-full px-3" : ""} w-full py-2 hover:cursor-pointer transition-discrete duration-200`}
                        >
                            <div
                                key={item.label}
                                className="flex flex-col items-center gap-0.5"
                                >
                                <div className="flex flex-col items-center gap-0.5">
                                    <Icon className={`size-5 ${isActive ? "text-stone-300" : "text-stone-800"}`}/>
                                    <span className={`text-[11px] font-medium tracking-widest ${isActive ? "text-stone-300" : "hidden"}`}>{item.label.toUpperCase().trim()}</span>
                                </div>
                            </div>  
                        </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}

export default MobileNav