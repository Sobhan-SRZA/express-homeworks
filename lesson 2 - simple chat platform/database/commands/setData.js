const fs = require("fs");
const getData = require("./getData");

/**
 * 
 * @param {"accounts" | "messages" | "users"} table 
 * @param {Array<{id:string value: object}>} data 
 * @param {string | undefined} id 
 * @returns {Array<{id:string value: object}>}
 */
module.exports = function (table, data, id) {
    const tables = ["accounts", "messages", "users", "chats"];

    if (!tables.includes(table))
        throw Error("DB: wrong table name!")

    if (id && !Array.isArray(data)) {
        let allData = getData(table);

        allData = allData.filter(a => a.id !== data.id)

        allData.push(data);

        data = allData;
    }

    fs.writeFileSync(`./database/${table}.json`, JSON.stringify(data, undefined, 4));

    return data;
}