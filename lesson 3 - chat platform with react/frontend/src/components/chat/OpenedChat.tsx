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
    emitEvent: <E extends keyof ClientToServerEvents>(event: E, payload?: EventPayload<ClientToServerEvents[E]>) => boolean;
  }
) {

  const message = useRef<HTMLTextAreaElement | null>(null);

  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  const sendMessage = () => {
    const messageContent = message.current?.value;
    message.current!.value = "";
    setIsEmpty(true);

    emitEvent("event", {
      type: "send_message",
      payload: {
        originalMessageId: Date.now().toString(),
        text: messageContent,
        to: id
      }
    })
  }



  return (
    <div className="flex flex-col justify-between"    >
      {/* Chat history */}
      <div>
        
      </div>


      {/* Sendding part */}
      <div className="bg-(--lgs-bg) rounded-4xl flex gap-3 p-2 place-self-center items-center w-[70%] flex-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if ((message.current?.value.length || 0) > 0){
              sendMessage();
            }
          }
        }}
      >
        <textarea
          name="message"
          id="message"
          ref={message}
          dir="auto"
          placeholder="پیام بنویسید..."
          className="empty:h-8 w-full rtl outline-0 bg-transparent placeholder:text-(--text)/50"
          onChange={(element) => {
            element.preventDefault();
            element.target.value.length > 0 ? setIsEmpty(false) : setIsEmpty(true)
          }}
        />
        <button
          onClick={sendMessage}
          form="message"
          disabled={isEmpty}
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