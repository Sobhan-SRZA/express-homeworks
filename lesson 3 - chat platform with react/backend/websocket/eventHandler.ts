import { CustomSocket } from "../types/requests";

export type ServerEventHandlers = {
    "send_message": (socket: CustomSocket, payload: any, userId: string, currentUser: any, onlineUsers: any) => Promise<void>;
    "get_chat_history": (socket: CustomSocket, payload: any, ...args: any[]) => Promise<void>;
    "get_user_status": (socket: CustomSocket, payload: any, ...args: any[]) => Promise<void>;
    "open_chat": (socket: CustomSocket, payload: any, ...args: any[]) => Promise<void>;
    "search_user": (socket: CustomSocket, payload: any, ...args: any[]) => Promise<void>;
    "typing": (socket: CustomSocket, payload: any, ...args: any[]) => Promise<void>;
    "update_message_status": (socket: CustomSocket, payload: any, ...args: any[]) => Promise<void>;
    "get_chats": (socket: CustomSocket, payload: any, ...args: any[]) => Promise<void>;
};

const eventHandlers = new Map<string, Function>();

export const loadEventHandlers = async () => {
    const fs = await import("fs");
    const path = await import("path");

    const files = fs.readdirSync(path.join(__dirname, "events"))
        .filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of files) {
        const eventName = file.replace(/\.(ts|js)$/, "");
        const handlerPath = `./events/${file}`;
        const handlerModule = await import(handlerPath);

        if (typeof handlerModule.default === "function") {
            eventHandlers.set(eventName, handlerModule.default);
            console.log(`✅ Event loaded: ${eventName}`);
        }
    }
};

export const handleEvent = async (
    socket: CustomSocket,
    data: { type: string; payload?: any },
    userId: string,
    currentUser: any,
    onlineUsers: any
) => {
    const { type, payload } = data;

    const handler = eventHandlers.get(type);

    if (handler) {
        try {
            await handler(socket, payload, userId, currentUser, onlineUsers);
        }
        
        catch (error) {
            console.error(`Error in event ${type}:`, error);
            socket.emit("error", { message: `خطا در اجرای ${type}` });
        }
    } 
    
    else {
        console.warn(`⚠️ No handler found for event: ${type}`);
        socket.emit("error", { message: `ایونت ناشناخته: ${type}` });
    }
};