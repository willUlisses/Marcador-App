
interface UserHeaderProps {
    username: string;
    booksRead: number;
    booksInQueue: number;
    totalPagesRead: number;
}


const UserHeader = (props: UserHeaderProps) => {

    return(
        <header className="w-full text-white flex flex-col items-center justify-center py-4 gap-4 bg-linear-to-r from-[#7A3B2E] to-[#bd7a4e]">
            <div className="flex flex-col items-center">
                <span className="text-stone-300/90 text-sm">Boa tarde,</span>
                <h2 className="text-white font-extrabold font-lora tracking-wide text-3xl">{props.username}</h2>
            </div>

            <div className="flex w-full items-center justify-evenly">
                <div className="flex flex-col items-center gap-1 border border-stone-300/40 bg-stone-300/10 rounded-md px-2 py-1">
                    <span>{props.booksRead}</span>
                    <span>LIDOS</span>
                </div>
                <div className="flex flex-col items-center gap-1 border border-stone-300/40 bg-stone-300/10 rounded-md px-2 py-1">
                    <span>{props.booksInQueue}</span>
                    <span>NA FILA</span>
                </div>
                <div className="flex flex-col items-center gap-1 border border-stone-300/40 bg-stone-300/10 rounded-md px-2 py-1">
                    <span>{props.totalPagesRead}</span>
                    <span>PÁGINAS</span>
                </div>
            </div>
        </header>
    )

}

export default UserHeader;