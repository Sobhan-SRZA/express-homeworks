import getData from "../../database/commands/getData";
import setData from "../../database/commands/setData";
import { Chat } from "../../database/commands/types";
import getHistory from "../messages/getHistory";

export default (startId: string, nextId: string) => {
    try {
        const chatData = setChats(startId, nextId);
        const nextChatData = setChats(nextId, startId);

        return chatData;
    }

    catch (e) {
        console.error("Error openning chat from database:", e)

        return null;
    }
}

function setChats(id1: string, id2: string) {
    const userAccount = getData("accounts", id2);

    if (!userAccount) {
        throw ("Account with " + id2 + " ID didn't founded!");
    }

    const starterAccount = getData("accounts", id1);

    if (!starterAccount) {
        throw ("Account with " + id1 + " ID didn't founded!");
    }

    const chats = getData("chats", id1);

    const messages = getHistory(starterAccount.value.id, userAccount.value.id);

    const data: Chat = {
        userId: id2,
        username: userAccount.value.username,
        unread_messages: messages?.filter(a => a.from === id2 && a.status !== "read").length || 0,
        last_message: messages?.reverse()[0] || null
    };

    const chatIndex = chats?.value?.findIndex(chat => `${chat.userId}` === `${id2}`);
    if (chats && !isNaN(chatIndex!) && chatIndex !== -1) {
        const chat = chats.value[chatIndex!];

        chat.last_message = data.last_message;
        chat.unread_messages = data.unread_messages;
        console.log("🚀 ~ chat:", chat)

        setData(
            "chats",
            chats,
            id1
        )
    }

    else {
        setData(
            "chats",
            {
                id: id1,
                value: chats && chats.value ? [...chats.value, data] : [data]
            },
            id1
        )
    }

    return data;
}