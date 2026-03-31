/**
 * 
 * @param {import("quick.db").QuickDB} db
 * @param {string} username 
 */
module.exports = async (db, username) => {
    const accounts = await db.get("accounts");

    if (!accounts)
        return false;

    const usernames = Object.keys(accounts).map(a => a.toLowerCase());

    if (usernames.includes(username.toLowerCase()))
        return true;

    return false;
}