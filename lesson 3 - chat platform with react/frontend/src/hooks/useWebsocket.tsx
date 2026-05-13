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

interface SocketMessage {
    type: string;
    code?: string;
    message?: string;
    payload?: unknown;
}

type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

interface UseWebSocketOptions {
    url: string;
    token: string;
    onAuthFail?: (socket: AppSocket) => void;
    onConnect?: (socketId: string) => void;
    onDisconnect?: (reason: string) => void;
}

type ServerToClientEvents = {
    connected: (user: unknown) => void;
    user_status: (data: unknown) => void;
    message: (msg: SocketMessage) => void;
};

type ClientToServerEvents = {
    get_initial_data: () => void;
    event: (data: unknown) => void;
    message: (msg: SocketMessage) => void;
};

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export default function useWebSocket({
    url,
    token,
    onAuthFail,
    onConnect,
    onDisconnect,
}: UseWebSocketOptions) {
    const socketRef = useRef<AppSocket | null>(null);

    const [messages, setMessages] = useState<SocketMessage[]>([]);
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
                msg.includes("token") ||
                msg.includes("auth") ||
                msg.includes("unauthorized")
            ) {
                console.log("🚀 ~ handleConnectError ~ msg:", msg)
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

        const handleMessage = (msg: SocketMessage) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("connected", handleConnectedEvent);
        socket.on("user_status", handleUserStatus);
        socket.on("message", handleMessage);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("connected", handleConnectedEvent);
            socket.off("user_status", handleUserStatus);
            socket.off("message", handleMessage);

            socket.disconnect();
            socketRef.current = null;
        };
    }, [url, token]);

    const emitEvent = useCallback(
        (event: keyof ClientToServerEvents, payload?: unknown) => {
            const socket = socketRef.current;

            if (!socket || !socket.connected) {
                console.warn("socket is not connected");
                return false;
            }

            if (payload === undefined) {
                socket.emit(event);
            }

            else {
                socket.emit(event, payload);
            }

            return true;
        },
        []
    );

    const sendMessage = useCallback(
        (msg: SocketMessage) => {
            return emitEvent("message", msg);
        },
        [emitEvent]
    );

    const disconnect = useCallback(() => {
        socketRef.current?.disconnect();
    }, []);

    const reconnect = useCallback(() => {
        socketRef.current?.connect();
    }, []);

    return {
        socket: socketRef.current,
        messages,
        status,
        isConnected,
        socketId,
        sendMessage,
        emitEvent,
        disconnect,
        reconnect,
    };
}