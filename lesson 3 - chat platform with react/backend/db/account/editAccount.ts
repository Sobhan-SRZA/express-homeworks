const checkUsername = require("./checkUsername");
const getData = require("../../database/commands/getData");
const setData = require("../../database/commands/setData");
const getAccount = require("./getAccount");

/**
 * 
 * @param {string} userId 
 * @param {string | undefined} username 
 * @param {string | undefined} hashedPassword 
 * @returns 
 */
module.exports = (userId, username, hashedPassword) => {
    try {
        const accounts = getData("accounts");

        const account = getAccount(userId);

        if (username) {
            if (checkUsername(username)) {
                throw Error("username was used before!")
            }

            account.value.username = username;

            setData("accounts", accounts);

            return true;
        }

        if (hashedPassword) {
            account.value.password = hashedPassword;

            setData("accounts", accounts);

            return true;
        }

        return false;
    }

    catch (error) {
        console.log("Error editing account from database:", error)

        return false;
    }
}