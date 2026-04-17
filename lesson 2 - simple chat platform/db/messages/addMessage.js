const getData = require("../../database/commands/getData");
const setData = require("../../database/commands/setData");
const chatId = require("../../utils/chatId");

/**
 * 
 * @param {string} from 
 * @param {string} to 
 * @param {string} text 
 * @returns {{ messageId: number from: string to: string text: string timestamp: string status: { sentToUser: boolean deliveredToUser: boolean seenByuser: boolean } deliveredAt: string | null seenAt: string | null }}
 */
module.exports = function (from, to, text) {
    const cid = chatId(from, to);
    let messages = getData("messages", cid);

    const message = {
        messageId: Date.now(),
        from,
        to,
        text,
        timestamp: new Date().toISOString(),
        status: {
            sentToUser: false,
            deliveredToUser: false,
            seenByuser: false
        },
        deliveredAt: null,
        seenAt: null
    };

    if (!messages || messages.length < 1) {
        messages = {
            id: cid,
            value: []
        }
    }

    messages.value.push(message);

    setData("messages", messages, cid);

    return message;
}
