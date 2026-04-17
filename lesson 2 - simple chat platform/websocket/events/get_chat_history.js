const getHistory = require("../../db/messages/getHistory");

/**
 * 
 * @param {WebSocket} ws 
 * @param {{ payload: { with: string } }} parsedMessage 
 * @param {string} senderId 
 * @returns {void}
 */
module.exports = async (ws, parsedMessage, senderId) => {

    const { with: otherUser } = parsedMessage.payload;

    const history = await getHistory(senderId, otherUser);

    ws.send(JSON.stringify({
        type: "chat_history",
        payload: {
            with: otherUser,
            messages: history
        }
    }));

    return;
}