const {
    QuickDB,
    JSONDriver
} = require("quick.db");

const db = new QuickDB({
    driver: new JSONDriver()
})

/**
 * 
 * @param {string} userId 
 * @param {string} username 
 * @param {number} timestamp 
 * @param {string} hashedPassword 
 * @returns 
 */
module.exports = async (userId, username, timestamp, hashedPassword) => {
    try {
        await db
            .table("accounts")
            .delete(`${userId}`)

        return true;
    }

    catch (error) {
        console.log("Error deleting account from database:", error)

        return false;
    }
}