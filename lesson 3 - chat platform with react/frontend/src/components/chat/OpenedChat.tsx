import type {
  ClientToServerEvents,
  EventPayload
} from "../../hooks/useWebsocket";
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { Check, CheckCheck, Clock, SendHorizonal } from "lucide-react";

type Message = {
  id: string;
  text: string;
  from: string;
  to: string;
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read"; // استاتوس پیام
};

export default function OpenedChat(
  {
    id,
    emitEvent,
    currentUserId
  }: {
    id: string;
    currentUserId: string;
    emitEvent: <E extends keyof ClientToServerEvents>(
      event: E,
      payload?: EventPayload<ClientToServerEvents[E]>
    ) => boolean;
  }
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

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
      id: Date.now().toString(),
      text,
      from: currentUserId,
      to: id,
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, newMessage]);

    emitEvent("event", {
      type: "send_message",
      payload: {
        originalMessageId: newMessage.id,
        text,
        to: id
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

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

  return (
    <div className="flex flex-col justify-between">
      {/* Header */}
      <div className="p-4 border-b border-(--border) flex items-center gap-3 bg-(--lgs-bg)">
        <div className="w-10 h-10 bg-blue-500 rounded-full" />
        <div>
          <p className="font-semibold">نام کاربر</p>
          <p className="text-sm text-green-500">آنلاین</p>
        </div>
      </div>

      {/* Messages List */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://...')] bg-repeat" // والپیپر چت دلخواه
      >
        {messages.map((msg) => {
          const isOwn = msg.from === currentUserId;

          return (
            <div
              key={msg.id}
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
                    {msg.timestamp.toLocaleTimeString("fa-IR", {
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
    </div>
  )
}