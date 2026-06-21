import {
    useCallback,
    useEffect,
    useState
} from "react";
import type {
    Chats,
    UseGetChatsOptions
} from "./type";

export default function useGetChats({
    socket,
    emitEvent
}: UseGetChatsOptions) {
    const [chats, setChats] = useState<Chats>([]);

    const getOpenChats = useCallback(() => {
        if (!socket?.connected)
            return;

        emitEvent("event", { type: "get_chats" });
    }, [emitEvent, socket]);


    useEffect(() => {
        if (!socket)
            return;

        const handleOpenChats = (data: any) => {
            console.log("✅ Received open chats:", data);
            setChats(data.chats || data);
        };

        socket.on("openned_chats", handleOpenChats);

        return () => {
            socket.off("openned_chats", handleOpenChats);
        };
    }, [socket]);

    return {
        getOpenChats,
        chats
    }
}