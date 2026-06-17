import {
    OnlineUsers,
    UserTokenVerify
} from "../../types/user";
import { CustomSocket } from "../../types/requests";
import getChat from "../../db/chat/getChat";

export default (socket: CustomSocket, payload: any, senderId: string, currentUser: UserTokenVerify, onlineUsers: OnlineUsers) => {
    const chats = getChat(senderId);

    socket.emit("openned_chats", {
        chats: chats,
        userId: senderId
    })

    return;
}