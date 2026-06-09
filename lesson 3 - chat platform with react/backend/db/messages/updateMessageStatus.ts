import { MessageStatus } from "../../database/commands/types";
import getData from "../../database/commands/getData";
import setData from "../../database/commands/setData";
import chatId from "../../utils/chatId";

export default function (userId: string, targetUserId: string, messageId: string, statusType: MessageStatus) {
    try {
        const cid = chatId(userId, targetUserId);;
        const messages = getData("messages", `${cid}`);
        if (!messages || !messages.value || messages.value.length < 1) {
            return null;
        }

        const messageIndex = messages.value.findIndex(msg => `${msg.messageId}` === `${messageId}`);

        if (messageIndex === -1) {
            return null;
        }

        const message = messages.value[messageIndex];
        const currentTime = Date.now();

        if (statusType === "sent") {
            message.status = "sent";
            message.seenAt = currentTime;
        }

        else if (statusType === "deliverd") {
            message.status = "deliverd";
            message.deliveredAt = currentTime;
        }

        else if (statusType === "seen") {
            message.status = "seen";
            message.seenAt = currentTime;
        }

        messages.value[messageIndex] = message;
        setData("messages", messages, `${cid}`);

        return message;
    }

    catch (e) {
        console.error("Updating message status has problem:", e);

        return null;
    }
}