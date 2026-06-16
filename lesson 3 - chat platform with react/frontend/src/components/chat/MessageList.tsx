import {
    Check,
    CheckCheck,
    Clock
} from "lucide-react";
import type { Message } from "../../hooks/useWebsocket";

export default function MessageList({
    messages,
    from,
    ref
}: {
    messages: Message[];
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
                    <div
                        key={msg.id}
                        className={`relative flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${isOwn
                                ? "bg-(--primary)/30 text-(--text) rounded-tr-none"
                                : "bg-(--lgs-bg) text-(--text) rounded-tl-none"
                                }`}
                        >
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                                {msg.text}
                            </p>

                        <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-[10px] opacity-70">
                                {new Date(msg.timestamp).toLocaleTimeString("fa-IR", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </span>

                            {isOwn && <MessageStatus status={msg.status} />}
                        </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}


export const MessageStatus = ({ status }: { status: Message["status"] }) => {
    console.log("🚀 ~ MessageStatus ~ status:", status)
    switch (status) {
        case "sending":
            return <Clock className="w-4 h-4 animate-spin text-gray-400" />;

        case "sent":
            return <Check className="w-4 h-4 text-gray-400" />;

        case "delivered":
            return <CheckCheck className="w-4 h-4 text-gray-400" />;

        case "read":
            return <CheckCheck className="w-4 h-4 text-blue-500" />;

        default:
            return null;
    }
};