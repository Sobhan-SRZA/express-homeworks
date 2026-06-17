import type { UserChat } from "../components/chat/types";

export interface ApplicationProbs {
  token: string;
}

export interface OpenChat extends UserChat {
  isOpen: boolean;
}

export type OpenChatState = OpenChat | null;