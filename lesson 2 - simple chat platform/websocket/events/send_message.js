const addMessage = require("../../db/messages/addMessage");
const updateMessageStatus = require("../../db/messages/updateMessageStatus");

/**
 * 
 * @param {WebSocket} ws 
 * @param {{ payload: { to: string text: string } }} parsedMessage 
 * @param {string} senderId 
 * @param {{ username: string }} currentUser 
 * @param {Map<string, WebSocket>} onlineUsers 
 * @returns {void}
 */
module.exports = async (ws, parsedMessage, senderId, currentUser, onlineUsers) => {
    const { to, text } = parsedMessage.payload;
    console.log(`message from ${currentUser.username} to ${to}: ${text}`);

    const savedMessage = addMessage(senderId, to, text);

    ws.send(JSON.stringify({
        type: 'message_sent_ack',
        payload: {
            originalMessageId: savedMessage.messageId,
            message: savedMessage
        }
    }));

    const targetClient = onlineUsers.get(to);

    if (targetClient) {
        targetClient.send(JSON.stringify({
            type: 'new_message',
            payload: savedMessage
        }));

        updateMessageStatus(to, senderId, savedMessage.messageId, 'delivered');

        targetClient.send(JSON.stringify({
            type: 'message_delivered_notification',
            payload: {
                messageId: savedMessage.messageId,
                deliveredAt: savedMessage.deliveredAt || new Date().toISOString()
            }
        }));

        return;
    }

    return;
}