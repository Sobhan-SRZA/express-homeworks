import type { History } from "../../components/message/types";
import type { Socket } from "socket.io-client";

export type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

export type EmitEvent = <E extends keyof ClientToServerEvents>(
    event: E,
    payload?: EventPayload<ClientToServerEvents[E]>
) => boolean;

export interface MessageError {
    message: string;
}

export type Chats = UserChat[];

export interface UseWebSocketOptions {
    url: string;
    token: string;
    onAuthFail?: (socket: AppSocket) => void;
    onConnect?: (socketId: string) => void;
    onDisconnect?: (reason: string) => void;
}

export interface UseGetChatsOptions {
    socket: AppSocket;
    emitEvent: EmitEvent;
}

export type ServerToClientEvents = {
    connected: (user: CurrentUser) => void;
    user_status: (data: unknown) => void;
    message_error: (data: MessageError) => void;
    message_sent_ack: (data: unknown) => void;
    message_delivered_notification: (data: unknown) => void;
    new_message: (data: MessageType) => void;
    openned_chats: (data: { userId: string, chats: Chats }) => void;
    chat_history: (data: {
        with: string,
        messages: History
    }) => void;
};

export type ClientToServerEvents = {
    get_initial_data: () => void;
    get_user_status: (data: { userId: string }) => void;
    get_chat_history: (data: { with: string }) => void;
    open_chat: (data: { userId: string }) => void;
    get_chats: () => void;
    send_message: (data: { to: string; text: string; originalMessageId: string; }) => void;
    event: (data: unknown) => void;

};

export type EventPayload<T> = T extends (data: infer P) => void
    ? P
    : T extends () => void
    ? undefined
    : never;

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export interface CurrentUser {
    id: string;
    created_at: number;
    username: string;
    expire: number;
}

export interface UseChatHistorysOptions {
    socket: AppSocket;
    emitEvent: EmitEvent;
}