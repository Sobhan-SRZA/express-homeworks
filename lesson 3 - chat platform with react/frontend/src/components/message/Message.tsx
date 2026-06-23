import { Check, CheckCheck, Clock } from "lucide-react";
import type { MessageProbs, MessageType } from "./types";

export default function Message({
    message,
    isOwnMessage
}: MessageProbs) {
    return (
        <div
            key={message.id}
            className={`relative flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${isOwnMessage
                    ? "bg-(--primary)/30 text-(--text) rounded-br-none"
                    : "bg-(--lgs-bg) text-(--text) rounded-bl-none"
                    }`}
            >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {message.text}
                </p>

                <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString("fa-IR", {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </span>

                    {isOwnMessage && <MessageStatus status={message.status} />}
                </div>
            </div>
        </div>
    )
}


export const MessageStatus = ({ status }: { status: MessageType["status"] }) => {
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