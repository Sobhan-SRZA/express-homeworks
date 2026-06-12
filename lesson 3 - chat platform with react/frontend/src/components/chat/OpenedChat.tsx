import type {
  ClientToServerEvents,
  EventPayload
} from "../../hooks/useWebsocket";
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
    <div>
      <textarea name="message" id="message" ref={message}></textarea>
      <button onClick={sendMessage} form="message">telegram</button>
    </div>
  )
}