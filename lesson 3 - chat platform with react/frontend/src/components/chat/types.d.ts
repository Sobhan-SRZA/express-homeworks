import type {
    ClientToServerEvents,
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
    emitEvent: <E extends keyof ClientToServerEvents>(
        event: E,
        payload?: EventPayload<ClientToServerEvents[E]>
    ) => boolean;
}