const getUserStatus = require("../../db/users/getUserStatus");

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
    const { userId } = parsedMessage.payload;
    const status = getUserStatus(userId);
    status.typing = true;
    
    ws.send(JSON.stringify({
        type: "typing_indicator",
        payload: status
    }));

    return;
}