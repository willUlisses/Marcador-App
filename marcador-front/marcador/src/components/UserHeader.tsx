
interface UserHeaderProps {
    username: string;
    booksRead: number;
    booksInQueue: number;
    totalPagesRead: number;
}


const UserHeader = (props: UserHeaderProps) => {

    return(
        <header className="w-full text-white flex flex-col items-center justify-center py-8 gap-4 bg-linear-to-br from-[#7A3B2E] via-[#7A3B2E] via-55% to-[#bd7a4e]">
            <div className="flex flex-col items-center">
                <span className="text-stone-300/90 text-sm">Boa tarde,</span>
                <h2 className="text-white font-extrabold font-lora tracking-wide text-3xl">{props.username}</h2>
            </div>

            <div className="grid grid-cols-3 max-w-sm gap-3 w-full items-center">
                <div className="flex flex-col items-center gap-1 border border-stone-300/40 bg-stone-300/10 rounded-xl px-3 py-2">
                    <span className="font-lora text-xl font-bold tracking-wider">{props.booksRead}</span>
                    <span className="text-xs tracking-wider text-stone-300/90 font-extrabold">LIDOS</span>
                </div>
                <div className="flex flex-col items-center gap-1 border border-stone-300/40 bg-stone-300/10 rounded-xl px-3 py-2">
                    <span className="font-lora text-xl font-bold tracking-wider">{props.booksInQueue}</span>
                    <span className="text-xs tracking-wider text-stone-300/90 font-extrabold">NA FILA</span>
                </div>
                <div className="flex flex-col items-center gap-1 border border-stone-300/40 bg-stone-300/10 rounded-xl px-3 py-2">
                    <span className="font-lora text-xl font-bold tracking-wider">{props.totalPagesRead}</span>
                    <span className="text-xs tracking-wider text-stone-300/90 font-extrabold">PÁGINAS</span>
                </div>
            </div>
        </header>
    )

}

export default UserHeader;