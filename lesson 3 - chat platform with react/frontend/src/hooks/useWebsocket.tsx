import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import {
    io,
    Socket
} from "socket.io-client";

export type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

export interface UseWebSocketOptions {
    url: string;
    token: string;
    onAuthFail?: (socket: AppSocket) => void;
    onConnect?: (socketId: string) => void;
    onDisconnect?: (reason: string) => void;
}

export type ServerToClientEvents = {
    connected: (user: unknown) => void;
    user_status: (data: unknown) => void;
};

export type ClientToServerEvents = {
    get_initial_data: () => void;
    get_user_status: (data: { userId: string }) => void;
    get_chat_history: (data: { with: string }) => void;
    open_chat: (data: { userId: string }) => void;
    send_message: (data: { to: string; text: string; originalMessageId: string; }) => void;
    event: (data: unknown) => void;
};

export type EventPayload<T> = T extends (data: infer P) => void
    ? P
    : T extends () => void
    ? undefined
    : never;

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

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

        const handleConnectedEvent = (user: unknown) => {
            console.log("server confirmed:", user);
        };

        const handleUserStatus = (data: unknown) => {
            console.log("status update:", data);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("connected", handleConnectedEvent);
        socket.on("user_status", handleUserStatus);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("connected", handleConnectedEvent);
            socket.off("user_status", handleUserStatus);

            socket.disconnect();
            socketRef.current = null;
        };
    }, [url, token]);

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

    return {
        socket: socketRef.current,
        status,
        isConnected,
        socketId,
        emitEvent,
        disconnect,
        reconnect
    };
}