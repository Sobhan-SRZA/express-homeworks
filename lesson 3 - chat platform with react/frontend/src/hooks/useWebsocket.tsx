import { useState, useEffect, useRef } from 'react';

interface SocketMessage {
    type: string;
    code: string;
    message: string;
    payload?: object;
}

export default function useWebSocket(url: string) {
    const [messages, setMessages] = useState<SocketMessage[]>([]);
    const socketRef = useRef<WebSocket>(null);

    useEffect(() => {
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            console.log('WebSocket connection established');
            sendMessage({ type: 'get_initial_data' });
        };

        socketRef.current.onmessage = (event) => {
            const data = event.data;

            if (data.type === "error") {
                if (["AUTH_EXPIRE", "AUTH_MISSING"].includes(data.code)) {
                    location.reload();
                }
            }

            setMessages(prev => [...prev, event.data]);
        };

        return () => {
            socketRef.current?.close();
        };
    }, [url]);

    const sendMessage = (msg: string | object) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {

            if (typeof msg !== "string")
                msg = JSON.stringify(msg);

            socketRef.current?.send(msg);
        }
    };

    return { messages, sendMessage, socket: socketRef.current };
}