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
 * @param {string | undefined} username 
 * @param {string | undefined} hashedPassword 
 * @returns 
 */
module.exports = async (userId, username, hashedPassword) => {
    try {
        const table = db.table("accounts")

        if (username) {
            await table.set(`${userId}.username`, username);

            return true;
        }

        if (hashedPassword) {
            await table.set(`${userId}.password`, hashedPassword);

            return true;
        }

        return false;
    }

    catch (error) {
        console.log("Error editing account from database:", error)

        return false;
    }
}