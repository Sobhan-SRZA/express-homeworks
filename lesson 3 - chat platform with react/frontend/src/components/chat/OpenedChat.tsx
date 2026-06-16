import type {
  ClientToServerEvents,
  EventPayload,
  Message
} from "../../hooks/useWebsocket";
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  Check,
  CheckCheck,
  Clock,
  SendHorizonal
} from "lucide-react";
import type { OpenChatState } from "../../pages/Application";
import DisplayUserAvatar from "./DisplayUserAvatar";
import type { UserChat } from "./ChatsList";

export default function OpenedChat(
  {
    chat,
    emitEvent,
    currentUserId,
    messages = [],
    openChat
  }: {
    chat: OpenChatState;
    currentUserId: string;
    messages: Message[];
    openChat: (userId: string) => void;
    emitEvent: <E extends keyof ClientToServerEvents>(
      event: E,
      payload?: EventPayload<ClientToServerEvents[E]>
    ) => boolean;
  }
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);


  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);

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

  const MessageStatus = ({ status }: { status: Message["status"] }) => {
    switch (status) {
      case "sending":
        return <Clock className="w-4 h-4 animate-spin text-gray-400" />;

      case "sent":
        return <Check className="w-4 h-4 text-gray-400" />;

      case "delivered":
        return <CheckCheck className="w-4 h-4 text-gray-400" />;

      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-500" />;

      default:
        return null;
    }
  };


  const resetTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.value = "";
      setIsEmpty(true);
      // ریست کردن ارتفاع
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

    const newMessage: Message = {
      messageId: Date.now().toString(),
      text,
      from: currentUserId,
      to: chat!.id,
      timestamp: Date.now(),
      status: "sending",
      deliveredAt: null,
      seenAt: null,
      sentAt: null
    };

    setLocalMessages((prev) => [...prev, newMessage]);

    emitEvent("event", {
      type: "send_message",
      payload: {
        originalMessageId: newMessage.messageId,
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

  return (
    <div className="flex flex-col justify-between"
      onAbort={() => {
        console.log("sex")
        console.log("openChat(id)", chat!.id)
        openChat(chat!.id)
      }}>

      {/* Header */}
      <div className="absolute top-5 bg-(--lgs-bg) rounded-4xl flex gap-3 p-2 place-self-center items-center w-[40%] flex-2">
        <DisplayUserAvatar chat={chat as UserChat} />

        <div>
          <p className="font-semibold">{chat!.name}</p>
          <p className={`text-sm ${chat!.status === "online" ? "text-green-500" : "text-gray-400"}`}>{chat!.status === "offline" ? get : chat?.status}</p>
        </div>
      </div>

      {/* Messages List */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3" // والپیپر چت دلخواه
      >
        {localMessages.map((msg) => {
          const isOwn = msg.from === currentUserId;

          return (
            <div
              key={msg.messageId}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl rounded-tr-none ${isOwn
                  ? "bg-(--primary) text-white"
                  : "bg-(--message-incoming) text-(--text)"
                  }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>

                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString("fa-IR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isOwn && <MessageStatus status={msg.status} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {/* Input Area */}
      <div className="absolute bottom-5 bg-(--lgs-bg) rounded-4xl flex gap-3 p-2 place-self-center items-center w-[60%] flex-2">
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