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
 * @returns {Promise<{username: string; id: string; created_at: number; password: string;} | null>} 
 */
module.exports = async (search) => {
    try {
        if (!search || typeof search !== "string")
            return null;

        const q = search.toLowerCase().trim();

        const accounts = await db.table("accounts").all();

        if (!accounts || accounts.length === 0)
            return null;

        // 1. ID exact
        let exactId = accounts.find(a => a.id === search);
        if (exactId)
            return exactId.value;


        // 2. username exact
        let exactUser = accounts.find(a => a.value.username.toLowerCase() === q);
        if (exactUser)
            return exactUser.value;

        // 3. username partial 
        let startsWith = accounts.find(a =>
            a.value.username.toLowerCase().startsWith(q)
        );
        if (startsWith)
            return startsWith.value;


        // 4. username fuzzy (شامل)
        let contains = accounts.find(a =>
            a.value.username.toLowerCase().includes(q)
        );
        if (contains)
            return contains.value;

        return null;
    }

    catch (error) {
        console.log("Error finding account from database:", error)

        return null;
    }
}