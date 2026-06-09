import type { ClientToServerEvents, EventPayload } from "../../hooks/useWebsocket";

export default function OpenedChat(
  { id, emitEvent }: {
    id: string;
    emitEvent: <E extends keyof ClientToServerEvents>(event: E, payload?: EventPayload<ClientToServerEvents[E]>) => boolean;
  }
) {
  return (
    <div
      onClick={() => {
        emitEvent("event", {
          type: "send_message",
          payload: {
            originalMessageId: Date.now().toString(),
            text: "se kon",
            to: id
          }
        })
      }}
    >OpenedChat</div>
  )
}