import {
  useMemo,
  useState
} from "react";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { MoveLeft } from "lucide-react";
import ChatsList, { type UserChat } from "../components/chat/ChatsList";
import useChatSearch from "../hooks/useChatSearch";
import useWebSocket from "../hooks/useWebsocket"
import SearchReuslt from "../components/chat/SearchReuslt";
import SearchInput from "../components/chat/SearchInput";
import OpenedChat from "../components/chat/OpenedChat";
import ClosedChat from "../components/chat/ClosedChat";
import backend from "../backend/backend"

interface ApplicationProbs {
  token: string;
}

interface OpenChat {
  isOpen: boolean;
  id: string;
}

export type OpenChatState = OpenChat | null;

export default function Application({ token }: ApplicationProbs) {
  const { emitEvent } = useWebSocket({
    token,
    url: backend.websocket,
    onAuthFail: (socket) => {
      window.location.reload();

      socket.close()

      return;
    }
  });

  const [openChat, setOpenChat] = useState<OpenChatState>(null);

  const chats: UserChat[] = [
    { id: "1", avatar: "/favicon.ico", muted: false, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777047725578 }, status: "offline", unread_message: 1 },
    { id: "2", muted: false, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777047925578 }, status: "offline", unread_message: 1 },
    { id: "3", avatar: "/favicon.ico", muted: true, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777947725578 }, status: "offline", unread_message: 250 },
    { id: "4", muted: false, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768048925358 }, status: "online", unread_message: 45 },
    { id: "5", muted: false, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777947725598 }, status: "offline", unread_message: 250 },
    { id: "6", muted: true, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768048925858 }, status: "online", unread_message: 45 },
    { id: "7", muted: true, name: "narges", last_message: { text: "کجایی", timestamp: 1778075241372 }, status: "online", unread_message: 69 },
    { id: "8", muted: true, name: "mmd", last_message: { text: "sexy boy", timestamp: 1777920999999 }, status: "online", unread_message: 0 },
    { id: "9", muted: true, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777047725678 }, status: "offline", unread_message: 1 },
    { id: "10", muted: true, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777047755578 }, status: "offline", unread_message: 1 },
    { id: "11", avatar: "/favicon.ico", muted: false, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777947525578 }, status: "offline", unread_message: 250 },
    { id: "12", avatar: "/favicon.ico", muted: true, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768043925358 }, status: "online", unread_message: 45 },
    { id: "13", avatar: "/favicon.ico", muted: false, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777941225578 }, status: "offline", unread_message: 250 },
    { id: "14", muted: true, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777047225578 }, status: "offline", unread_message: 1 },
    { id: "16", muted: false, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777947735578 }, status: "offline", unread_message: 250 },
    { id: "15", muted: false, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768028925358 }, status: "online", unread_message: 45 },
    { id: "17", avatar: "/favicon.ico", muted: false, name: "reza", last_message: { text: "کونی چطوری", timestamp: 1777027725578 }, status: "offline", unread_message: 1 },
    { id: "18", muted: false, name: "ehsan", last_message: { text: "fuck you", timestamp: 1777947725578 }, status: "offline", unread_message: 250 },
    { id: "19", muted: false, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768041925358 }, status: "online", unread_message: 45 },
    { id: "52", avatar: "/favicon.ico", muted: false, name: "helia", last_message: { text: "سلام عزیزم", timestamp: 1768048925358 }, status: "online", unread_message: 45 },
    { id: "554642", muted: false, name: "setayesh hazery", last_message: { text: "Ashkum", timestamp: 1768048925358 }, status: "online", unread_message: 45 },
    { id: "613", muted: true, name: "sepehr", last_message: { text: "bro where are you???", timestamp: Date.now() }, status: "offline", unread_message: 5 },
  ];

  const { query, setQuery, results } = useChatSearch(chats);

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) =>
      (b.last_message?.timestamp ?? 0) -
      (a.last_message?.timestamp ?? 0)
    );
  }, [chats]);

  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  return (
    <>
      <main id="platform" className="flex justify-between items-center text-center min-h-full min-w-full p-0 inset-0 m-0 relative">
        <section id="chat" className="flex flex-col w-full">
          {openChat?.id
            && <OpenedChat id={openChat.id} />
            || <ClosedChat />}
        </section>

        <section id="conversetion" className="flex flex-col max-w-full max-h-screen bg-(--card-bg) border-l-(--border) border-l-2">

          <div className="flex place-self-center items-center gap-2 py-2">
            {searchOpen
              && <MoveLeft
                className="size-10 bg-transparent text-(--text) cursor-pointer p-1 rounded-full hover:bg-(--border)/30 transition-colors duration-300"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
              />

              || <Bars3Icon
                className="size-10 bg-transparent text-(--text) cursor-pointer p-1 rounded-full hover:bg-(--border)/30 transition-colors duration-300"
                onClick={() => {
                  emitEvent("event", {
                    type:"send_message",
payload:{                    originalMessageId: Date.now().toString(),
                    text: "se kon",
                    to: "19676527011955802113"}
                  })
                }}
              />
            }

            {/* Searching part */}
            <SearchInput
              query={query}
              setQuery={setQuery}
              setSearchOpen={setSearchOpen}
            />
          </div>

          <div className="w-full h-[0.1rem] bg-(--border)" />

          {searchOpen
            && <SearchReuslt
              results={results}
              onSelect={setOpenChat}
            />

            || <ChatsList
              chats={sortedChats}
              onSelect={setOpenChat}
            />}
        </section>
      </main>
    </>
  )
}