import useWebSocket from "../hooks/useWebsocket"
import backend from "../backend/backend"
import { useState } from "react";

interface ApplicationProbs {
  token: string;
}

export default function Application({ token }: ApplicationProbs) {
  const { } = useWebSocket(`${backend.websocket}?token=${token}`);

  const [openChat, setOpenChat] = useState<boolean>(false);

  const chats = [
    { name: "mmd", last_message: { text: "sexy boy", timestamp: 1778047725255 } }
  ]

  return (
    <>

    </>
  )
}
