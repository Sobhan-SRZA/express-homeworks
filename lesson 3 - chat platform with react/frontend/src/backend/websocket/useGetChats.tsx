import type { Chats, UseGetChatsOptions } from "./type";
import { useCallback, useState } from "react";

export default function useGetChats({
    socket,
    
}: UseGetChatsOptions) {
    const [chats, setChats] = useState<Chats | null>(null);

    const getOpenChats = useCallback(() => {
        socket.on("openned_chats", (data) => {
            console.log("openned_chats.data", data)
            setChats(data.chats);
        });
    }, []);

    const updateOpenChats = useCallback(() => {
        socket.on("openned_chats", (data) => {
            console.log("openned_chats.data", data)
            setChats(data.chats);
        });
    }, []);


    return {
        getOpenChats,
        updateOpenChats,
        chats
    }
}