import { CustomSocket } from "../../types/requests";
import getHistory from "../../db/messages/getHistory";

export default (socket: CustomSocket, payload: any, senderId: string) => {
    const { with: otherUser } = payload;

    const history = getHistory(senderId, otherUser);

    socket.emit("chat_history", {
        with: otherUser,
        messages: history
    });

    return;
}