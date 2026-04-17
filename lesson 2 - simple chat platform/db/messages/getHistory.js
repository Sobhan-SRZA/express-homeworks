const getData = require("../../database/commands/getData");
const chatId = require("../../utils/chatId");

/**
 * 
 * @param {string} u1 
 * @param {string} u2 
 * @returns {{ messageId: number from: string to: string text: string timestamp: string status: { sentToUser: boolean deliveredToUser: boolean seenByuser: boolean } deliveredAt: string | null seenAt: string | null }[]}
 */
module.exports = function (u1, u2) {

    const cid = chatId(u1, u2);
    const messages = getData("messages", cid).value || [];

    return messages;
}