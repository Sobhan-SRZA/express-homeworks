import type {
    ClientToServerEvents,
    EmitEvent,
    EventPayload
} from "../../backend/websocket/type";
import type { OpenChatState } from "../../pages/Application";
import type { MessageType } from "../message/types";

export interface OpenChatProbs {
    chat: OpenChatState;
    setChat: React.Dispatch<React.SetStateAction<OpenChatState>>;
    currentUserId: string;
    messages: MessageType[];
    openChat: (userId: string) => void;
    emitEvent: EmitEvent;
}

export interface ChatMessageProbs {
    chat: UserChat;
    onSelect: ChatListProbs["onSelect"];
}

export interface UserChat {
    id: string;
    last_seen: number;
    muted: boolean;
    name: string;
    last_message: {
        text: string;
        timestamp: number;
    };
    status: string;
    unread_message: number;
    avatar?: string;
}

export interface ChatListProbs {
    chats: UserChat[];
    onSelect: React.Dispatch<React.SetStateAction<OpenChatState>>;
}

export interface ChatProbs {
    chat: UserChat;
    setChat: OpenChatProbs["setChat"];
    messages: MessageType[];
    currentUserId: OpenChatProbs["currentUserId"];
    setMessages: React.Dispatch<React.SetStateAction<ChatProbs["messages"]>>;
    emitEvent: EmitEvent;
}