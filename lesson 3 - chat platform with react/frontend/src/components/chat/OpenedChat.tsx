import type {
  ClientToServerEvents,
  EventPayload
} from "../../hooks/useWebsocket";
import {
  useRef,
  useState
} from "react";
import { SendHorizonal } from "lucide-react";

export default function OpenedChat(
  {
    id,
    emitEvent
  }: {
    id: string;
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

    emitEvent("event", {
      type: "send_message",
      payload: {
        originalMessageId: Date.now().toString(),
        text: text,
        to: id
      }
    })

    resetTextarea();
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter → خط جدید (رفتار پیش‌فرض textarea)
        return;
      }

      else {
        // فقط Enter → ارسال
        e.preventDefault(); // جلوگیری از اضافه شدن خط جدید
        sendMessage();
      }
    }
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (!textarea)
      return;

    textarea.style.height = "auto";

    const newHeight = Math.min(textarea.scrollHeight, 180); // حداکثر حدود ۸-۹ خط
    textarea.style.height = `${newHeight}px`;

    setIsEmpty(textarea.value.trim().length === 0);
  };

  return (
    <div className="flex flex-col justify-between">
      {/* Chat history */}
      <div className="">
        { }
      </div>


      {/* Sendding part */}
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