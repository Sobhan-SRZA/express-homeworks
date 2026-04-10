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
 * @returns {{username: string; id: string; created_at: number; password: string;}} 
 */
module.exports = async (userId) => {
    try {
        await db
            .table("accounts")
            .get(`${userId}`)

        return true;
    }

    catch (error) {
        console.log("Error getting account from database:", error)

        return false;
    }
}