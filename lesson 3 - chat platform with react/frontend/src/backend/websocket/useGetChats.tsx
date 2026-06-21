import { io } from "socket.io-client";
import type { AppSocket, Chats, UseGetChatsOptions } from "./type";
import { useCallback, useState } from "react";

export default function useGetChats({
    socket,
    emitEvent,
    url,
    token,
}: UseGetChatsOptions) {
    const [chats, setChats] = useState<Chats | null>(null);

    const getOpenChats = useCallback(() => {
        emitEvent("event", {
            type: "get_chats"
        })
    }, [emitEvent]);

    const updateOpenChats = useCallback(() => {
        if (!socket) {
            socket = io(url, {
                transports: ["websocket"],
                auth: { token },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 10000
            });

            return;
        }

        socket.on("openned_chats", (data) => {
            console.log("🚀 ~ useGetChats ~ data:", data)

            setChats(data.chats)
        });

        return;
    }, [socket]);

    return {
        getOpenChats,
        updateOpenChats,
        chats
    }
}