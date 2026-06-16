import {
    OnlineUsers,
    UserTokenVerify
} from "../../types/user";
import { CustomSocket } from "../../types/requests";
import { Message } from "../../database/commands/types";
import updateMessageStatus from "../../db/messages/updateMessageStatus";
import addMessage from "../../db/messages/addMessage";
import getAccount from "../../db/account/getAccount";

export default (socket: CustomSocket, payload: any, senderId: string, currentUser: UserTokenVerify, onlineUsers: OnlineUsers) => {
    handleSendMessage(socket, payload, senderId, currentUser, onlineUsers);

    return;
};

function handleSendMessage(socket: CustomSocket, payload: any, senderId: string, currentUser: UserTokenVerify, onlineUsers: OnlineUsers) {
    const { to, text, originalMessageId } = payload;

    let savedMessage: Message | null;

    try {
        if (!getAccount(senderId)) {
            throw "Invalid account";
        }

        if (!getAccount(to)) {
            throw "Wrong user to send message";
        }

        console.log("🚀 ~ handleSendMessage ~ to, text, originalMessageId:", to, text, originalMessageId)

        savedMessage = addMessage(senderId, to, text);

        socket.emit('message_sent_ack', {
            originalMessageId: originalMessageId || savedMessage!.id,
            messageId: savedMessage!.id,
            sentAt: savedMessage!.timestamp
        });

        const targetClient = onlineUsers.get(to);
        if (targetClient) {
            targetClient.emit('new_message', { message: savedMessage });

            updateMessageStatus(to, senderId, savedMessage!.id, 'delivered');
            targetClient.emit('message_delivered_notification', {
                messageId: savedMessage!.id
            });
        }

        else {
            console.log(`User ${to} is offline. Message will be delivered later.`);
        }

    }

    catch (e: any) {
        console.error("Error sending message:", e);
        socket.emit('message_error', {
            message: e.message || 'Failed to send message',
            originalMessageId: originalMessageId
        });
    }
}