import type { UseGetChatsOptions } from "./type";
import { useCallback } from "react";

export default function useWebSocket({
    socket
}: UseGetChatsOptions) {
    const updateOpenChatMessages = useCallback(() => {
        socket.on("chat_history", (data) => {
            console.log("chat_history.data", data)
        });
    }, []);



    return {

    }
}