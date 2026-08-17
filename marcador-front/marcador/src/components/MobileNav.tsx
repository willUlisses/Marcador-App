import { Book, ChartNoAxesColumnIncreasing, Home, MessageSquare, User } from "lucide-react"
import { useState } from "react"

const MobileNav = () => {
    const [currentTab, setCurrentTab] = useState("Estante")

    const navItem = [
        {
            icon: <Home className={`size-5 ${currentTab === "Estante" ? "text-stone-300" : "text-stone-800"}`} />,
            label: "Estante"
        },
        {
            icon: <Book className={`size-5 ${currentTab === "Biblioteca" ? "text-stone-300" : "text-stone-800"}`} />,
            label: "Biblioteca"
        },
        {
            icon: <ChartNoAxesColumnIncreasing className={`size-5 ${currentTab === "Métricas" ? "text-stone-300" : "text-stone-800"}`} />,
            label: "Métricas"
        },
        {
            icon: <MessageSquare className={`size-5 ${currentTab === "Reflexões" ? "text-stone-300" : "text-stone-800"}`} />,
            label: "Reflexões"
        },
        {
            icon: <User className={`size-5 ${currentTab === "Perfil" ? "text-stone-300" : "text-stone-800"}`} />,
            label: "Perfil"
        }
    ]

    return (
        <nav className="bg-[#f1ebe0] px-2 py-1 left-4 right-4 rounded-full border-stone-400/50 border fixed bottom-4 z-50">
            <div className="flex items-center">
                {navItem.map((item) => (
                    <div
                        key={item.label}
                        className={`${currentTab === item.label ? "bg-amber-950 rounded-full px-3" : ""} w-full h-full py-2 hover:cursor-pointer transition-discrete duration-200`}
                        onClick={() => setCurrentTab(item.label)}>
                        <div className="flex flex-col items-center gap-0.5">
                            {item.icon}
                            <span className={`text-[11px] font-medium tracking-widest ${currentTab === item.label ? "text-stone-300" : "hidden"}`}>{item.label.toUpperCase().trim()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </nav>
    )
}

export default MobileNav