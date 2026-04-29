const getData = require("../../database/commands/getData");
const setData = require("../../database/commands/setData");
const chatId = require("../../utils/chatId");

/**
 * 
 * @param {string} userId 
 * @param {string} targetUserId 
 * @param {string} messageId 
 * @param {'sent' | 'delivered' | 'seen'} statusType 
 * @returns {{ messageId: number from: string to: string text: string timestamp: string status: { sentToUser: boolean deliveredToUser: boolean seenByuser: boolean } deliveredAt: string | null seenAt: string | null }}
 */
module.exports = async function (userId, targetUserId, messageId, statusType) {
    const cid = chatId(userId, targetUserId);;
    const messages = getData("messages", `${cid}`);
    if (!messages || !messages.value || messages.value.length < 1)
        return false;

    const messageIndex = messages.value.findIndex(msg => `${msg.messageId}` === `${messageId}`);

    if (messageIndex === -1)
        return false;

    const message = messages.value[messageIndex];
    const currentTime = new Date().toISOString();

    if (statusType === 'sent') {
        message.status.sentToUser = true;
    }

    else if (statusType === 'delivered') {
        message.status.sentToUser = true;
        message.status.deliveredToUser = true;
        message.deliveredAt = currentTime;
    }

    else if (statusType === 'seen') {
        message.status.sentToUser = true;
        message.status.deliveredToUser = true;
        message.deliveredAt = currentTime;
        message.status.seenByuser = true;
        message.seenAt = currentTime;
    }

    messages.value[messageIndex] = message;
    setData("messages", messages, `${cid}`);

    return message;
}
