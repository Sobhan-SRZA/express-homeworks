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
 * @param {string} u1 
 * @param {string} u2 
 * @returns {Promise<{ messageId: number from: string to: string text: string timestamp: string status: { sentToUser: boolean deliveredToUser: boolean seenByuser: boolean } deliveredAt: string | null seenAt: string | null }[]>}
 */
module.exports = async function (u1, u2) {
    const cid = chatId(u1, u2);
    const table = db.table("messages");

    const messages = await table.get(`${cid}`) || [];

    return messages;
}