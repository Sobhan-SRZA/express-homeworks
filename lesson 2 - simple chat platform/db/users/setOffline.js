const {
    QuickDB,
    JSONDriver
} = require("quick.db");

const db = new QuickDB({
    driver: new JSONDriver()
})

module.exports = async function (userId) {
    const users = db.table("users");

    await users.set(`${userId}.online`, false);

    await users.set(`${userId}.lastSeen`, new Date().toISOString());

    return true;
}