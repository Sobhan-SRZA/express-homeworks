export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export interface MessageType {
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

export type History = MessageType[];

export interface MessageProbs {
    message: MessageType,
    isOwnMessage: boolean
}

export interface MessageListProbs {
    messages: MessageType[];
    from: string;
    ref: React.RefObject<HTMLDivElement | null>;
}