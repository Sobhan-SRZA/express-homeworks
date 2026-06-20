import type { Chats, UseGetChatsOptions } from "./type";
import { useCallback, useState } from "react";

export default function useGetChats({
    socket,
    emitEvent
}: UseGetChatsOptions) {
    const [chats, setChats] = useState<Chats | null>(null);

    const getOpenChats = useCallback(() => {
        emitEvent("event", {
            type: "get_chats"
        })
    }, [emitEvent]);

    const updateOpenChats = useCallback(() => {
        socket.on("openned_chats", (data) => {
            console.log("🚀 ~ useGetChats ~ data:", data)

            setChats(data.chats)
        });
    }, [socket]);

    return {
        getOpenChats,
        updateOpenChats,
        chats
    }
}