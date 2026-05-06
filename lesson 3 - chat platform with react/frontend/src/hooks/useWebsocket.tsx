import { useState, useEffect, useRef } from 'react';

export default function useWebSocket(url: string) {
    const [messages, setMessages] = useState<any[]>([]);
    const socketRef = useRef<WebSocket>(null);

    useEffect(() => {
        socketRef.current = new WebSocket(url);

        socketRef.current.onmessage = (event) => {
            setMessages(prev => [...prev, event.data]);
        };

        // socketRef.current.onerror = (error) => {
        //     console.error('WebSocket error:', error);
        // };

        return () => {
            socketRef.current?.close();
        };
    }, [url]);

    const sendMessage = (msg: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current?.send(msg);
        }
    };

    return { messages, sendMessage, socket: socketRef.current };
}