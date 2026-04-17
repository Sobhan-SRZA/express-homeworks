const {
    QuickDB,
    JSONDriver
} = require("quick.db");

const db = new QuickDB({
    driver: new JSONDriver()
})

const chatId = require("../../utils/chatId");

/**
 * 
 * @param {string} userId 
 * @param {string} targetUserId 
 * @param {string} messageId 
 * @param {'sent' | 'delivered' | 'seen'} statusType 
 * @returns {Promise<{ messageId: number from: string to: string text: string timestamp: string status: { sentToUser: boolean deliveredToUser: boolean seenByuser: boolean } deliveredAt: string | null seenAt: string | null }>}
 */
module.exports = async function (userId, targetUserId, messageId, statusType) {
    const cid = chatId(userId, targetUserId);
    const table = db.table("messages");
    const messages = await table.get(`${cid}`);
    if (!messages)
        return false;

    const messageIndex = messages.findIndex(msg => msg.messageId === messageId);

    if (messageIndex === -1)
        return false;

    const message = messages[messageIndex];
    const currentTime = new Date().toISOString();

    if (statusType === 'sent') {
        message.status.sentToUser = true;
    }

    else if (statusType === 'delivered') {
        message.status.deliveredToUser = true;
        message.deliveredAt = currentTime;
    }

    else if (statusType === 'seen') {
        message.status.seenByuser = true;
        message.seenAt = currentTime;
    }

    messages[messageIndex] = message;
    await messages.set(`${cid}`, messages);

    return message;
}
