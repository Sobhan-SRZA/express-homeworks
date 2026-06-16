import tables from "./tables";

export type Tables = typeof tables[number];

export type TableDataMap = {
    [K in Tables]: K extends "users" ? UserStatus :
    K extends "accounts" ? Account :
    K extends "messages" ? Message[] :
    K extends "chats" ? Chat :
    K extends "files" ? File :
    never;
};

export type Table = keyof TableDataMap;

export interface Account {
    created_at: number;
    username: string;
    id: string;
    password: string;
}

export interface Message {
    id: string;
    from: string;
    to: string;
    text: string;
    timestamp: number;
    status: MessageStatus;
    sentAt: number | null;
    deliveredAt: number | null;
    readAt: number | null;
}

export interface UserStatus {
    userId: string;
    online: boolean;
    lastSeen: string | null;
    typing?: boolean;
}

export interface Chat {
    userId: string;
    username: string;
    unread_messages: number;
    last_message: Message | null;
}

export interface File {
    originalName: string;
    storedName: string;
    filePath: string;
    type: string;
    size: number;
    uploadedBy: string;
    uploadTime: number;
}

export interface DatabaseEntry<T> {
    id: string;
    value: T;
}

export type MessageStatus = "sent" | "delivered" | "read";