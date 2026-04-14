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
 * @param {string} from 
 * @param {string} to 
 * @param {string} text 
 * @returns {Promise<{ messageId: number from: string to: string text: string timestamp: string status: { sentToUser: boolean deliveredToUser: boolean seenByuser: boolean } deliveredAt: string | null seenAt: string | null }>}
 */
module.exports = async function (from, to, text) {
    const cid = chatId(from, to);
    const table = db.table("messages");

    const message = {
        messageId: Date.now(),
        from,
        to,
        text,
        timestamp: new Date().toISOString(),
        status: {
            sentToUser: false, // اولش false هست، چون هنوز ACK نرفته
            deliveredToUser: false,
            seenByuser: false
        },
        deliveredAt: null,
        seenAt: null
    };

    // push کردن پیام
    await table.push(`${cid}`, message);

    return message;
}
