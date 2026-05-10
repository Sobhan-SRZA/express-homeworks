const getData = require("../../database/commands/getData");

/**
 * 
 * @param {string} id 
 * @returns {{originalName: string storedName: string filePath: string type: string size: size uploadedBy: string uploadTime: Date} | null}
 */
module.exports = function (id) {
    try {
        const file = getData("files", id);

        if (!file)
            throw Error("File with " + id + " ID didn't founded!");

        return file.value;
    }

    catch (error) {
        console.log("Error getting file from database:", error)

        return null;
    }
}