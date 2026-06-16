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

        const messageIndex = messages.value.findIndex(msg => `${msg.id}` === `${messageId}`);

        if (messageIndex === -1) {
            return null;
        }

        const message = messages.value[messageIndex];
        const currentTime = Date.now();

        if (statusType === "sent") {
            message.status = "sent";
            message.readAt = currentTime;
        }

        else if (statusType === "delivered") {
            message.status = "delivered";
            message.deliveredAt = currentTime;
        }

        else if (statusType === "read") {
            message.status = "read";
            message.readAt = currentTime;
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