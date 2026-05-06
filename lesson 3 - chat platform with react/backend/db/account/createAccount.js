const generateId = require("../../utils/generateId");
const getData = require("../../database/commands/getData");
const setData = require("../../database/commands/setData");

/**
 * 
 * @param {string} username 
 * @param {string} hashedPassword 
 * @returns 
 */
module.exports = (username, hashedPassword) => {
    try {
        const timestamp = Date.now();
        const userId = generateId();

        const accounts = getData("accounts");
        accounts.push({
            id: `${userId}`,
            value: {
                created_at: timestamp,
                username,
                id: userId,
                password: hashedPassword
            }
        });

        setData("accounts", accounts);

        return {
            created_at: timestamp,
            username,
            id: userId
        };
    }

    catch (error) {
        console.log("Error creating account from database:", error)

        return null;
    }
}