const getData = require("../../database/commands/getData");

/**
 * 
 * @param {string} username 
 */
module.exports = (username) => {
    const accounts = getData("accounts");

    if (!accounts || accounts.length < 1)
        return false;

    const usernames = accounts.map(a => a.value.username.toLowerCase());

    if (usernames.includes(username.toLowerCase()))
        return true;

    return false;
}