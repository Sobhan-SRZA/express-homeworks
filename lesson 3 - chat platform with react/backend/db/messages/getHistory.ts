import getData from "../../database/commands/getData";
import chatId from "../../utils/chatId";

export default function (u1: string, u2: string) {
    try {
        const cid = chatId(u1, u2);
        const messages = getData("messages", cid)?.value || [];

        return messages;
    }

    catch (e) {
        console.error("Getting chat history has problem:", e);

        return null;
    }
}