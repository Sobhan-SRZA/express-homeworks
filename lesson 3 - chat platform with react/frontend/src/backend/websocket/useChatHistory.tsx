import type { UseChatHistorysOptions } from "./type";
import {
    useCallback,
    useEffect,
    useState
} from "react";
import type { History } from "../../components/message/types";

export default function useChatHistory({
    socket,
    emitEvent
}: UseChatHistorysOptions) {
    const [history, setHistory] = useState<History | null>(null);

    const getHistory = useCallback((userId: string) => {
        if (!socket?.connected)
            return;

        emitEvent("event", {
            type: "get_chat_history",
            payload: { with: userId }
        })
    }, [emitEvent, socket]);

    useEffect(() => {
        if (!socket)
            return;

        const handleChatHistory = (data: any) => {
            console.log("✅ chat_history received:", data);
            setHistory(data.messages || data);
        };

        socket.on("chat_history", handleChatHistory);

        return () => {
            socket.off("chat_history", handleChatHistory);
        };
    }, [socket]);

    return {
        history,
        getHistory
    }
}