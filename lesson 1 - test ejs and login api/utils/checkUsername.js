/**
 * 
 * @param {import("quick.db").QuickDB} db
 * @param {string} username 
 */
module.exports = async (db, username) => {
    const accounts = await db.get("accounts");

    if (!accounts)
        return false;

    const usernames = Object.values(accounts).map(a => a.username.toLowerCase());

    if (usernames.includes(username.toLowerCase()))
        return true;

    return false;
}