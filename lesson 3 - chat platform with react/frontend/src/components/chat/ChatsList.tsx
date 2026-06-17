import type { ChatListProbs } from "./types";
import ChatMessage from "./ChatMessage";

export default function ChatsList({
    chats,
    onSelect
}: ChatListProbs) {
    return (
        <ul className="flex flex-col p-0 py-3 justify-start items-center text-center overflow-hidden overscroll-y-contain overflow-y-scroll custom-scroll h-screen scroll-smooth px-2 gap-2">
            {chats
                .map((chat) => {
                    return (
                        <ChatMessage
                            chat={chat}
                            onSelect={onSelect}
                        />
                    )
                })}
        </ul>
    )
}