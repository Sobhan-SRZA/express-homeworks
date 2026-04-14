/**
 * 
 * @param {import("quick.db").QuickDB} db
 * @param {string} username 
 */
module.exports = async (db, username) => {
    const accounts = await db.table("accounts").all();

    if (!accounts)
        return false;

    const usernames = accounts.map(a => a.value.username.toLowerCase());

    if (usernames.includes(username.toLowerCase()))
        return true;

    return false;
}