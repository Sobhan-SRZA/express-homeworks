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
    messageId: number;
    from: string;
    to: string;
    text: string;
    timestamp: number;
    status: MessageStatus;
    sentAt: number | null;
    deliveredAt: number | null;
    seenAt: number | null;
}

export interface UserStatus {
    userId: string;
    online: boolean;
    lastSeen: string | null;
}

export interface Chat { }

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

export type MessageStatus = "sent" | "deliverd" | "seen";