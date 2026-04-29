const getData = require("../../database/commands/getData");
const setData = require("../../database/commands/setData");
const chatId = require("../../utils/chatId");

/**
 * 
 * @param {{originalName: string storedName: string filePath: string type: string size: size uploadedBy: string uploadTime: Date}} record 
 * @returns {{originalName: string storedName: string filePath: string type: string size: size uploadedBy: string uploadTime: Date}}
 */
module.exports = function (record) {
    let files = getData("files", record.uploadedBy);

   if (!files || files.length < 1) {
        files = {
            id: record.uploadedBy,
            value: []
        }
    }

    files.value.push(record);

    setData("files", files, record.uploadedBy);

    return record;
}