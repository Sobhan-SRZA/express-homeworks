import type {
    AppSocket,
    ClientToServerEvents,
    ConnectionStatus,
    CurrentUser,
    EventPayload,
    UseWebSocketOptions
} from "./type";
import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { io } from "socket.io-client";

export default function useWebSocket({
    url,
    token,
    onAuthFail,
    onConnect,
    onDisconnect
}: UseWebSocketOptions) {
    const socketRef = useRef<AppSocket | null>(null);

    const [status, setStatus] = useState<ConnectionStatus>("idle");
    const [isConnected, setIsConnected] = useState(false);
    const [socketId, setSocketId] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        if (!url || !token)
            return;

        setStatus("connecting");

        const socket: AppSocket = io(url, {
            transports: ["websocket"],
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000
        });

        socketRef.current = socket;

        const handleConnect = () => {
            setIsConnected(true);
            setStatus("connected");
            setSocketId(socket.id ?? null);

            if (socket.id)
                onConnect?.(socket.id);

            console.log("✅ connected", socket.id);
        };

        const handleDisconnect = (reason: string) => {
            setIsConnected(false);
            setStatus("disconnected");
            setSocketId(null);

            onDisconnect?.(reason);
            console.log("❌ disconnected:", reason);
        };

        const handleConnectError = (err: Error) => {
            setIsConnected(false);
            setStatus("error");

            console.error("❌ connect error:", err.message);

            const msg = err.message.toLowerCase();

            // refresh/login 
            if (
                msg.includes("token")
                || msg.includes("auth")
                || msg.includes("unauthorized")
            ) {
                if (onAuthFail) {
                    onAuthFail(socket);

                    return;
                }
            }
        };

        const handleConnectedEvent = (user: CurrentUser) => {
            setCurrentUser(user);

            console.log("server confirmed:", user);
        };

        const handleUserStatus = (data: unknown) => {
            console.log("status update:", data);
        };

        const handleMessageError = (data: unknown) => {
            console.log("get an error from requesting:", data);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("connected", handleConnectedEvent);
        socket.on("user_status", handleUserStatus);
        socket.on("message_error", handleMessageError);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("connected", handleConnectedEvent);
            socket.off("user_status", handleUserStatus);
            socket.off("message_error", handleMessageError);

            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    const emitEvent = useCallback(
        <E extends keyof ClientToServerEvents>(
            event: E,
            payload?: EventPayload<ClientToServerEvents[E]>
        ) => {
            const socket = socketRef.current;

            if (!socket || !socket.connected) {
                console.warn("socket is not connected");

                return false;
            }

            if (payload === undefined) {
                socket.emit(event as keyof ClientToServerEvents);
            }

            else {
                // @ts-ignore
                socket.emit(event, payload);
            }

            return true;
        },
        []
    );

    const disconnect = useCallback(() => {
        socketRef.current?.disconnect();
    }, []);

    const reconnect = useCallback(() => {
        socketRef.current?.connect();
    }, []);

    const [currentChatId, setCurrentChatId] = useState<string | null>(null);

    const openChat = useCallback((userId: string) => {
        setCurrentChatId(userId);
        console.log("openChat.useCallback.userId", userId)

        emitEvent("event", {
            type: "get_chat_history",
            payload: { with: userId }
        });
    }, [emitEvent]);


    return {
        socket: socketRef.current,
        status,
        isConnected,
        socketId,
        currentUser,
        openChat,
        currentChatId,
        emitEvent,
        disconnect,
        reconnect
    };
}