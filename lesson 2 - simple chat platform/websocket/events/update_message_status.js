const updateMessageStatus = require("../../db/messages/updateMessageStatus");

/**
 * 
 * @param {WebSocket} ws 
 * @param {{ payload: { messageId: string targetUserId: string statusType: string } }} parsedMessage 
 * @param {string} senderId 
 * @param {{ username: string }} currentUser 
 * @param {Map<string, WebSocket>} onlineUsers 
 * @returns {void}
 */
module.exports = async (ws, parsedMessage, senderId, currentUser, onlineUsers) => {
    const { messageId, targetUserId, statusType } = parsedMessage.payload;

    const updatedMessage = updateMessageStatus(senderId, targetUserId, messageId, statusType);

    if (updatedMessage) {
        const senderClient = onlineUsers.get(senderId);
        if (senderClient) {
            senderClient.send(JSON.stringify({
                type: `message_${statusType}_notification`,
                payload: {
                    messageId: updatedMessage.messageId,
                    userId: senderId,
                    [statusType === 'delivered' ? 'deliveredAt' : 'seenAt']: updatedMessage[statusType === 'delivered' ? 'deliveredAt' : 'seenAt']
                }
            }));
        }
    }

}