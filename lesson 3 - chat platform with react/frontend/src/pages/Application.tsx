import {
  useEffect,
  useMemo,
  useState
} from "react";
import type {
  ApplicationProbs,
  OpenChatState
} from "./types";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { MoveLeft } from "lucide-react";
import useChatHistory from "../backend/websocket/useChatHistory";
import useChatSearch from "../backend/websocket/useChatSearch";
import useWebSocket from "../backend/websocket/useWebsocket"
import SearchReuslt from "../components/search/SearchResult";
import useGetChats from "../backend/websocket/useGetChats";
import SearchInput from "../components/search/SearchInput";
import OpenedChat from "../components/chat/OpenedChat";
import ClosedChat from "../components/chat/ClosedChat";
import ChatsList from "../components/chat/ChatsList";
import backend from "../backend/backend"

export default function Application({ token }: ApplicationProbs) {
  const {
    setCurrentChatId,
    emitEvent,
    currentUser,
    openChat,
    socket
  } = useWebSocket({
    token,
    url: backend.websocket,
    onAuthFail: (socket) => {
      window.location.reload();

      socket.close()

      return;
    }
  });

  const [chat, setChat] = useState<OpenChatState>(null);
  console.log("🚀 ~ Application ~ chat:", chat)

  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  const { chats, getOpenChats } = useGetChats({ socket, emitEvent })

  useEffect(() => {
    if (socket?.connected) {
      getOpenChats();
    }
  }, [socket?.connected, getOpenChats]);

  const { history, getHistory } = useChatHistory({ socket, emitEvent })
  console.log("🚀 ~ Application ~ history:", history)

  useEffect(() => {
    console.log("🚀 ~ Application ~ chat?.id:", chat?.id)
    if (chat?.id) {
      getHistory(chat.id);
    }
  }, [chat, getHistory]);

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) =>
      (b.last_message?.timestamp ?? 0) -
      (a.last_message?.timestamp ?? 0)
    );
  }, [chats]);

  const { query, setQuery, results } = useChatSearch(chats);

  return (
    <>
      <main id="platform" className="flex justify-between items-center text-center min-h-full min-w-full p-0 inset-0 m-0 relative">
        <section id="chat" className="flex flex-col w-full">
          {
            (chat && chat.isOpen)

            && <OpenedChat
              emitEvent={emitEvent}
              chat={chat}
              setChat={setChat}
              currentUserId={currentUser!.id!}
              messages={history!}
              openChat={openChat}
            />

            || <ClosedChat />
          }
        </section>

        <section id="conversetion" className="flex flex-col max-w-full max-h-screen bg-(--card-bg) border-l-(--border) border-l-2">

          <div className="flex place-self-center items-center gap-2 py-2">
            {
              searchOpen

              && <MoveLeft
                className="size-10 bg-transparent text-(--text) cursor-pointer p-1 rounded-full hover:bg-(--border)/30 transition-colors duration-300"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
              />

              || <Bars3Icon className="size-10 bg-transparent text-(--text) cursor-pointer p-1 rounded-full hover:bg-(--border)/30 transition-colors duration-300" />
            }

            {/* Searching part */}
            <SearchInput
              query={query}
              setQuery={setQuery}
              setSearchOpen={setSearchOpen}
            />
          </div>

          <div className="w-full h-[0.1rem] bg-(--border)" />

          {
            searchOpen

            && <SearchReuslt
              results={results}
              onSelect={setChat}
            />

            || <ChatsList
              chats={sortedChats}
              onSelect={setChat}
            />
          }
        </section>
      </main>
    </>
  )
}