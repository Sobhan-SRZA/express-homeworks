const {
    QuickDB,
    JSONDriver
} = require("quick.db");

const db = new QuickDB({
    driver: new JSONDriver()
})

const chatId = require("../../utils/chatId");

module.exports = async function (from, to, text) {
    const cid = chatId(from, to);

    const message = {
        messageId: Date.now(),
        from,
        to,
        text,
        timestamp: new Date().toISOString()
    };

    // push کردن پیام
    await db
        .table("messages")
        .push(`${cid}`, message);

    return message;
}
