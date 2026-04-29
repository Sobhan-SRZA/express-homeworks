const getData = require("./getData");
const tables = require("./tables");
const fs = require("fs");

/**
 * 
 * @param {(typeof tables)[number]} table 
 * @param {Array<{id:string value: object}>} data 
 * @param {string | undefined} id 
 * @returns {Array<{id:string value: object}>}
 */
module.exports = function (table, data, id) {

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