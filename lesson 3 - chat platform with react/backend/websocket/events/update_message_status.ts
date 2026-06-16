import {
    OnlineUsers,
    UserTokenVerify
} from "../../types/user";
import { CustomSocket } from "../../types/requests";
import updateMessageStatus from "../../db/messages/updateMessageStatus";

export default (socket: CustomSocket, payload: any, senderId: string, currentUser: UserTokenVerify, onlineUsers: OnlineUsers) => {
    const { messageId, targetUserId, statusType } = payload;

    const updatedMessage = updateMessageStatus(senderId, targetUserId, messageId, statusType);

    if (updatedMessage) {
        const senderClient = onlineUsers.get(senderId);
        if (senderClient) {
            senderClient.send(JSON.stringify({
                type: `message_${statusType}_notification`,
                payload: {
                    messageId: updatedMessage.id,
                    userId: senderId,
                    [statusType === 'delivered' ? 'deliveredAt' : 'readAt']: updatedMessage[statusType === 'delivered' ? 'deliveredAt' : 'readAt']
                }
            }));
        }
    }
}