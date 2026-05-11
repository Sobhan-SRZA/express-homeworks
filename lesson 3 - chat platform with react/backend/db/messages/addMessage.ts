import getData from "../../database/commands/getData";
import chatId from "../../utils/chatId";

export default function (from: string, to: string, text: string) {
    const cid = chatId(from, to);
    let messages = getData("messages", cid);

    const message = {
        messageId: Date.now(),
        from,
        to,
        text,
        timestamp: new Date().toISOString(),
        sentToUser: false,
        status: "sent",
        deliveredAt: null,
        seenAt: null
    };

    if (!messages || !messages.value || messages.value.length < 1) {
        messages = {
            id: cid,
            value: []
        }
    }

    messages.value.push(message);

    setData("messages", messages, cid);

    return message;
}
