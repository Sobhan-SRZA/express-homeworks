import getData from "../../database/commands/getData";
import setData from "../../database/commands/setData";
import { Chat } from "../../database/commands/types";
import getHistory from "../messages/getHistory";

export default (startId: string, nextId: string) => {
    try {
        const userAccount = getData("accounts", nextId);

        if (!userAccount) {
            throw ("Account with " + nextId + " ID didn't founded!");
        }

        const starterAccount = getData("accounts", startId);

        if (!starterAccount) {
            throw ("Account with " + startId + " ID didn't founded!");
        }

        const chats = getData("chats", startId);

        const messages = getHistory(starterAccount.value.id, userAccount.value.id);

        const data: Chat = {
            userId: nextId,
            username: userAccount.value.username,
            unread_messages: messages?.filter(a => a.from === nextId && a.status !== "read").length || 0,
            last_message: messages?.reverse()[0] || null
        };

        const chatIndex = chats?.value?.findIndex(chat => `${chat.userId}` === `${nextId}`);
        if (chats && !isNaN(chatIndex!) && chatIndex !== -1) {
            const chat = chats.value[chatIndex!];

            chat.last_message = data.last_message;
            chat.unread_messages = data.unread_messages;
            console.log("🚀 ~ chat:", chat)

            setData(
                "chats",
                chats,
                startId
            )
        }

        else {
            setData(
                "chats",
                {
                    id: startId,
                    value: chats && chats.value ? [...chats.value, data] : [data]
                },
                startId
            )
        }

        return data;
    }

    catch (e) {
        console.error("Error openning chat from database:", e)

        return null;
    }
}