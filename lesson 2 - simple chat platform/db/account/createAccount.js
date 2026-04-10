const {
    QuickDB,
    JSONDriver
} = require("quick.db");
const generateUserId = require("../../utils/generateUserId");

const db = new QuickDB({
    driver: new JSONDriver()
})

/**
 * 
 * @param {string} username 
 * @param {string} hashedPassword 
 * @returns 
 */
module.exports = async (username, hashedPassword) => {
    try {
        const timestamp = Date.now();
        const userId = generateUserId(username, timestamp);

        await db
            .table("accounts")
            .set(`${userId}`, {
                created_at: timestamp,
                username,
                id: userId,
                password: hashedPassword
            })

        return {
            created_at: timestamp,
            username,
            id: userId
        };
    }

    catch (error) {
        console.log("Error creating account from database:", error)

        return false;
    }
}