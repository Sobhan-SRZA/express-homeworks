import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  MoveRight,
  SendHorizonal
} from "lucide-react";
import type { OpenChatProbs } from "./types";
import type { MessageType } from "../message/types";
import type { UserChat } from "./ChatsList";
import DisplayUserAvatar from "../user/DisplayUserAvatar";
import MessageList from "../message/MessageList";

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);


  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [localMessages, setLocalMessages] = useState<MessageType[]>(messages);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, scrollToBottom]);



  const resetTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.value = "";
      setIsEmpty(true);

      textareaRef.current.style.height = "auto";
    }
  };

  const sendMessage = () => {
    const textarea = textareaRef.current;
    if (!textarea)
      return;

    const text = textarea.value.trim();
    if (text.length === 0)
      return;

    const newMessage: MessageType = {
      id: Date.now().toString(),
      text,
      from: currentUserId,
      to: chat!.id,
      timestamp: Date.now(),
      status: "sending",
      deliveredAt: null,
      readAt: null,
      sentAt: null
    };

    setLocalMessages((prev) => [...prev, newMessage]);

    emitEvent("event", {
      type: "send_message",
      payload: {
        originalMessageId: newMessage.id,
        text,
        to: chat!.id
      }
    })

    resetTextarea();
    scrollToBottom();
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta)
      return;

    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
    setIsEmpty(ta.value.trim().length === 0);
  };

  function timeAgo(timestamp: number | Date): string {
    const now = new Date().getTime();
    const past = new Date(timestamp).getTime();
    const diffInSeconds = Math.floor((now - past) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    if (diffInSeconds < 60)
      return 'لحظاتی پیش';

    else if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / intervals.minute)} دقیقه پیش`;

    else if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / intervals.hour)} ساعت پیش`;

    else if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / intervals.day)} روز پیش`;

    else if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / intervals.week)} هفته پیش`;

    else if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / intervals.month)} ماه پیش`;

    return `${Math.floor(diffInSeconds / intervals.year)} سال پیش`;
  }

  useEffect(() => {
    openChat(chat!.id)
  }, [chat, openChat]);

  return (
    <div className="flex flex-col justify-between">

      {/* Header */}
      <div className="absolute top-5 rounded-4xl flex gap-3 p-2 place-self-center justify-between w-[40%] flex-2 shadow-2xl backdrop-blur-lg border border-(--border)/40 bg-(--lgs-bg)/30 z-20">
        <DisplayUserAvatar chat={chat as UserChat} />

        <div className="place-self-center justify-items-start flex-1">
          <p className="font-semibold">{chat!.name}</p>
          <p className={`text-sm ${chat!.status === "online" ? "text-green-500" : "text-gray-400"}`}>{chat!.status === "offline" ? timeAgo(chat!.last_seen) : chat!.status}</p>
        </div>

        <MoveRight
          className="place-self-center  size-10 bg-transparent text-(--text) cursor-pointer p-1 rounded-full hover:bg-(--border)/30 transition-colors duration-300"
          onClick={() => {
            setChat(null)
          }}
        />
      </div>

      {/* Messages List */}
      <MessageList
        ref={chatContainerRef}
        from={currentUserId}
        messages={localMessages}
      />


      {/* Input Area */}
      <div className="absolute bottom-5 border border-(--border)/40 bg-(--lgs-bg)/30 rounded-4xl flex gap-3 p-2 place-self-center items-center w-[60%] flex-2 shadow-2xl backdrop-blur-lg z-20">
        <textarea
          ref={textareaRef}
          dir="auto"
          placeholder="پیام بنویسید..."
          className="flex-1 max-h-45 min-h-10 empty:h-8 py-2 rtl outline-none bg-transparent placeholder:text-(--text)/50 text-[15px] resize-none leading-relaxed"
          onChange={autoResize}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <button
          onClick={sendMessage}
          disabled={isEmpty}
          className="cursor-pointer bg-(--hover) rounded-full size-10 disabled:opacity-60 disabled:cursor-not-allowed place-self-end"
        >
          <SendHorizonal
            className="size-[70%] place-self-center"
          />
        </button>
      </div>
    </div >
  )
}