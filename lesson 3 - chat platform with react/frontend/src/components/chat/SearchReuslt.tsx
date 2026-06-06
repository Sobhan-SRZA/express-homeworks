import type { OpenChatState } from "../../pages/Application";
import type { UserChat } from "./ChatsList"

export default function SearchReuslt({
    results,
    onSelect
}: {
    results: UserChat[];
    onSelect: React.Dispatch<React.SetStateAction<OpenChatState>>;
}) {
    return (
        <ul className={`flex flex-col p-0 py-3 justify-start items-center text-center overflow-hidden overscroll-y-contain overflow-y-scroll custom-scroll h-screen scroll-smooth px-2 gap-2`}>
            {
                results.length < 1

                && <li className="flex justify-center text-center items-center p-4 w-full min-w-xs rounded-2xl">
                    <p className="rtl">چتی پیدا نشد.</p>
                </li>

                || results
                    .map((chat) => {
                        return (
                            <li className="flex justify-between items-center cursor-pointer p-4 w-full min-w-xs hover:bg-(--hover)/20 transition-colors rounded-2xl"
                                key={chat.id}
                                onClick={() => onSelect({ isOpen: true, id: chat.id })}
                            >

                                <div className="felx flex-col justify-center items-center text-left h-full w-max">
                                    {chat.unread_message > 0 && <span className={`flex flex-col mt-2 w-fit px-2 rounded-full font-bold text-(--text)/80 text-[0.7rem] p-[0.2rem] ${!chat.muted ? "bg-green-600/70" : "bg-gray-400/70"}`}>{chat.unread_message}</span>}
                                </div>

                                <div className="flex gap-2">
                                    {/* profile */}
                                    <div className="flex flex-col text-right">
                                        <h3 className="font-semibold text-[1.1rem] text-(--text)">{chat.name}</h3>
                                        <p className="text-(--text)/60 text-[0.80rem]">{chat.last_message.text}</p>
                                    </div>

                                    <div className="relative">
                                        <img src="/favicon.ico" alt="" className="size-13 rounded-full" />
                                        <span className={`rounded-full size-4 absolute inset-0 top-9 left-0.5 border-3 border-(--card-bg) ${chat.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                                    </div>
                                </div>
                            </li>
                        )
                    })}
        </ul>
    )
}