const {
    QuickDB,
    JSONDriver
} = require("quick.db");

const db = new QuickDB({
    driver: new JSONDriver()
})

/**
 * 
 * @param {string} search 
 * @returns {Promise<{username: string; id: string; created_at: number; password: string;}>} 
 */
module.exports = async (search) => {
    try {
        const accounts = await db.table("accounts").all();

        if (!accounts) return null;

        const user = accounts.find(a => {
            return a.value.username.toLowerCase() === search.toLowerCase() || a.id === search
        })?.value;

        return user || null;
    }

    catch (error) {
        console.log("Error finding account from database:", error)

        return false;
    }
}