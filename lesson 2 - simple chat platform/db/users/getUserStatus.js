const {
    QuickDB,
    JSONDriver
} = require("quick.db");

const db = new QuickDB({
    driver: new JSONDriver()
})

module.exports = async function (userId) {
    const users = db.table("users");

    const online = await users.get(`${userId}.online`) || false;
    const lastSeen = await users.get(`${userId}.lastSeen`) || null;

    return { userId, online, lastSeen };
}