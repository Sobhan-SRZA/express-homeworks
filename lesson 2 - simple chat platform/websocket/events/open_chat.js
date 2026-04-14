const getAccount = require("../../db/account/getAccount");

/**
 * 
 * @param {WebSocket} ws 
 * @param {{ payload: { userId: string } }} parsedMessage 
 * @param {string} senderId 
 * @param {{ username: string }} currentUser 
 * @returns {void}
 */
module.exports = async (ws, parsedMessage, senderId, currentUser) => {
    const { userId } = parsedMessage.payload;
    console.log(`user ${currentUser.username} is oppend chat room with ${userId}.`);
    const targetUser = await getAccount(userId);
    ws.send(JSON.stringify({ type: 'chat_opened', payload: targetUser }));

    return;
}