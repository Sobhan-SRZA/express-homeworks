import type { UseChatHistorysOptions } from "./type";
import {
    useCallback,
    useState
} from "react";
import type { History } from "../../components/message/types";

export default function useWebSocket({
    socket,
    emitEvent
}: UseChatHistorysOptions) {
    const [history, setHistory] = useState<History | null>(null);

    const updateHistory = useCallback((userId: string) => {
        emitEvent("event", {
            type: "get_chat_history",
            payload: { with: userId }
        })
    }, [emitEvent]);

    const getHistory = useCallback(() => {
        socket.on("chat_history", (data) => {
            console.log("chat_history.data", data)
            setHistory(data.messages)
        });
    }, []);



    return {
        history,
        updateHistory,
        getHistory
    }
}