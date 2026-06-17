import {
    Check,
    CheckCheck,
    Clock
} from "lucide-react";
import type { MessageType } from "../../hooks/useWebsocket";
import Message from "./Message";

export default function MessageList({
    messages,
    from,
    ref
}: {
    messages: MessageType[];
    from: string;
    ref: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <div
            ref={ref}
            className="flex-1 overscroll-y-contain overflow-y-scroll custom-scroll max-h-screen scroll-smooth p-4 py-20 space-y-3"
        >
            {messages.map((msg) => {
                const isOwn = msg.from === from;

                return (
                    <Message
                        isOwnMessage={isOwn}
                        message={msg}
                    />
                );
            })}
        </div>
    )
}