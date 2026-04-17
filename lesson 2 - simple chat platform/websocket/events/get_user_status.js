const getUserStatus = require("../../db/users/getUserStatus");

/**
 * 
 * @param {WebSocket} ws 
 * @param {{ payload: { userId: string } }} parsedMessage 
 * @returns {void}
 */
module.exports = async (ws, parsedMessage) => {
    const { userId } = parsedMessage.payload;
    const status = getUserStatus(userId);

    ws.send(JSON.stringify({
        type: "user_status",
        payload: status
    }));

    return;
}