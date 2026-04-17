const searchAccounts = require("../../db/account/searchAccounts");

/**
 * 
 * @param {WebSocket} ws 
 * @param {{ payload: { query: string } }} parsedMessage 
 * @param {string} senderId 
 * @param {{ username: string }} currentUser 
 * @returns {void}
 */
module.exports = async (ws, parsedMessage, senderId, currentUser) => {
    const { query, size } = parsedMessage.payload;
    console.log(`searching: ${query} from: ${currentUser.username}`);

    const foundUsers = searchAccounts(query);

    ws.send(JSON.stringify({
        type: 'search_results', payload: foundUsers, size
    }));

    return;
}