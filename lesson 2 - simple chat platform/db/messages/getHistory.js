const {
    QuickDB,
    JSONDriver
} = require("quick.db");

const db = new QuickDB({
    driver: new JSONDriver()
})

const chatId = require("../../utils/chatId");

module.exports = async function (u1, u2) {
    const cid = chatId(u1, u2);
    
    return await db
        .table("messages")
        .get(`${cid}`) || [];
}