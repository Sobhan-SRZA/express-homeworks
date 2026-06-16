import getData from "../../database/commands/getData";
import setData from "../../database/commands/setData";
import { Chat } from "../../database/commands/types";
import getHistory from "../messages/getHistory";

export default (starterId: string, userId: string) => {
    try {
        const userAccount = getData("accounts", userId);

        if (!userAccount) {
            throw ("Account with " + userId + " ID didn't founded!");
        }

        const starterAccount = getData("accounts", starterId);

        if (!starterAccount) {
            throw ("Account with " + starterId + " ID didn't founded!");
        }

        // const chat = getData("chats", starterId);

        // // if (chat) {
        // //     return chat.value;
        // // }

        const messages = getHistory(starterAccount.value.id, userAccount.value.id);

        const data: Chat = {
            userId: userId,
            username: userAccount.value.username,
            unread_messages: messages?.filter(a => a.from === userId && a.status !== "seen").length || 0,
            last_message: messages?.reverse()[0] || null
        };

        setData(
            "chats",
            {
                id: starterId,
                value: data
            },
            starterId
        )

        return data;
    }

    catch (e) {
        console.error("Error openning chat from database:", e)

        return null;
    }
}