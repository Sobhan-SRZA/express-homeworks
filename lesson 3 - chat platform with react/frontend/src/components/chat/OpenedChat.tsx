import {
  useEffect,
  useState
} from "react";
import type { OpenChatProbs } from "./types";
import type { MessageType } from "../message/types";
import Chat from "./Chat";

export default function OpenedChat(
  {
    chat,
    setChat,
    emitEvent,
    currentUserId,
    messages = [],
    openChat
  }: OpenChatProbs
) {
  const [localMessages, setLocalMessages] = useState<MessageType[]>(messages);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);


  useEffect(() => {
    if (chat && chat.isOpen) {
      openChat(chat.userId);
    }
  }, [chat, openChat]);

  return (
    <Chat
      chat={chat!}
      setChat={setChat}
      messages={localMessages}
      currentUserId={currentUserId}
      setMessages={setLocalMessages}
      emitEvent={emitEvent}
    />
  )
}