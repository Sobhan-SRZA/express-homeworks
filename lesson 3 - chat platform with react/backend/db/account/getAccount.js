const getData = require("../../database/commands/getData");

/**
 * 
 * @param {string} userId 
 * @returns {{username: string; id: string; created_at: number; password: string;} | null} 
 */
module.exports = (userId) => {
    try {
        const account = getData("accounts", userId);

        if (!account)
            throw Error("Account with " + userId + " ID didn't founded!");

        return account.value;
    }

    catch (error) {
        console.log("Error getting account from database:", error)

        return null;
    }
}