/**
 * 
 * @param {object} data 
 * @param {Map<string, WebSocket>} onlineUsers 
 * @returns {void}
 */
module.exports = async (data, onlineUsers) => {
    const json = JSON.stringify(data);
    for (const client of onlineUsers.values()) {
        client.send(json);
    }

    return;
}