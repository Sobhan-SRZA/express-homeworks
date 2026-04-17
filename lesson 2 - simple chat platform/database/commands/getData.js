const fs = require("fs");

/**
 * 
 * @param {"accounts" | "messages" | "users" | "chats"} table 
 * @param {string | undefined} id 
 * @returns {Array<{id:string value: object}>}
 */
module.exports = function (table, id) {
    const tables = ["accounts", "messages", "users", "chats"];

    if (!tables.includes(table))
        throw Error("DB: wrong table name!")

    let data;
    try {
        data = JSON.parse(fs.readFileSync(`./database/${table}.json`).toString("utf8"));

        if (id) {
            foundedId = data.find(a => a.id === `${id}`)
            if(foundedId)
                data = foundedId;
        }
    }

    catch {
        data = []
    }

    return data
}