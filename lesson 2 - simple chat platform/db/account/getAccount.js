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
 * @returns {Promise<{username: string; id: string; created_at: number; password: string;} | null>} 
 */
module.exports = async (userId) => {
    try {
        const account = await db
            .table("accounts")
            .get(`${userId}`)

        return account;
    }

    catch (error) {
        console.log("Error getting account from database:", error)

        return null;
    }
}