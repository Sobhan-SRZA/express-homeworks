const getAccount = require("../../db/account/getAccount");
const getUserStatus = require("../../db/users/getUserStatus");

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
    const status = await getUserStatus(userId);

    const user = {
        id: targetUser.id,
        username: targetUser.username,
        created_at: targetUser.created_at,
        status
    }

    ws.send(JSON.stringify({ type: 'chat_opened', payload: user }));

    return;
}