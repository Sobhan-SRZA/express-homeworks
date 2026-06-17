import {
    useEffect,
    useState
} from "react";
import type { UserChat } from "../../components/chat/types";

export default function useChatSearch(chats: UserChat[]) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<UserChat[]>([]);

    useEffect(() => {
        if (!query.trim()) {
            if (results.length > 0) {
                setResults([]);
            }

            return;
        }

        const filtered = chats.filter(chat =>
            chat.name.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filtered);
    }, [query]);

    return {
        query,
        setQuery,
        results
    }
}