import type {
  ClientToServerEvents,
  EventPayload
} from "../../hooks/useWebsocket";
import {
  Send,
  SendHorizonal
} from "lucide-react";
import { useRef } from "react";

export default function OpenedChat(
  { id, emitEvent }: {
    id: string;
    emitEvent: <E extends keyof ClientToServerEvents>(event: E, payload?: EventPayload<ClientToServerEvents[E]>) => boolean;
  }
) {

  const message = useRef<HTMLTextAreaElement | null>(null);

  const sendMessage = () => {
    emitEvent("event", {
      type: "send_message",
      payload: {
        originalMessageId: Date.now().toString(),
        text: message.current?.value,
        to: id
      }
    })
  }

  return (
    <div className="flex flex-col justify-between">
      {/* Chat history */}
      <div>

      </div>


      {/* Sendding part */}
      <div className="bg-(--lgs-bg) rounded-4xl flex gap-3 p-2 place-self-center items-center w-[70%] flex-2">
        <textarea
          name="message"
          id="message"
          ref={message}
          dir="auto"
          placeholder="پیام بنویسید..."
          className="empty:h-8 w-full rtl outline-0 bg-transparent placeholder:text-(--text)/50"
        />
        <button
          onClick={sendMessage}
          form="message"
          disabled={(message.current?.value.length || 0) < 1}
          className="cursor-pointer bg-(--hover) rounded-full size-10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <SendHorizonal
            className="size-[70%] place-self-center"
          />
        </button>
      </div>
    </div>
  )
}