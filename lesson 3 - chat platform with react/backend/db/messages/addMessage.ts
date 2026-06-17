import { Message } from "../../database/commands/types";
import openChat from "../chat/openChat";
import getData from "../../database/commands/getData";
import setData from "../../database/commands/setData";
import chatId from "../../utils/chatId";

export default function (from: string, to: string, text: string) {
    try {
        const cid = chatId(from, to);
        let messages = getData("messages", cid);

        const currentTime = Date.now();
        const message: Message = {
            id: currentTime.toString(),
            from,
            to,
            text,
            timestamp: currentTime,
            status: "sent",
            sentAt: currentTime,
            deliveredAt: null,
            readAt: null
        };

        if (!messages || !messages.value || messages.value.length < 1) {
            messages = {
                id: cid,
                value: []
            }
        }

        messages.value.push(message);

        setData("messages", messages, cid);

        openChat(from, to);

        return message;
    }

    catch (e) {
        console.error("Sending message has problem:", e);

        return null;
    }
}