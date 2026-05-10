const getAccount = require("./getAccount");
const getData = require("../../database/commands/getData");
const setData = require("../../database/commands/setData");

/**
 * 
 * @param {string} userId 
 * @returns {boolean}
 */
module.exports = (userId) => {
    try {
        const accounts = getData("accounts");

        const account = getAccount(userId);

        setData("accounts", accounts.filter(a => a.id !== account.id));

        return true;
    }

    catch (error) {
        console.log("Error deleting account from database:", error)

        return false;
    }
}