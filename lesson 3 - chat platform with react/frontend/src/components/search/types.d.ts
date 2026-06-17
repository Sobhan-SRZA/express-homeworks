import type { OpenChatState } from "../../pages/Application";
import type { UserChat } from "../chat/ChatsList";

export interface SearchResultProbs {
    results: UserChat[];
    onSelect: React.Dispatch<React.SetStateAction<OpenChatState>>;
}

export interface SearchInputProbs {
    query: string;
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}