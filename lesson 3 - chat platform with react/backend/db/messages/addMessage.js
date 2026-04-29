const getData = require("../../database/commands/getData");
const setData = require("../../database/commands/setData");
const chatId = require("../../utils/chatId");

/**
 * 
 * @param {string} from 
 * @param {string} to 
 * @param {string} text 
 * @param {{name: string file: string type: string}[] | undefined} attachment
 * @param {"text" | "emoji" | "image" | "video" | "voice" | "music" | "file"} type 
 * @returns {{ messageId: number from: string to: string text: string type: string timestamp: string status: { sentToUser: boolean deliveredToUser: boolean seenByuser: boolean } deliveredAt: string | null seenAt: string | null }}
 */
module.exports = function (from, to, text, type, attachments, timestamp) {
    const cid = chatId(from, to);
    let messages = getData("messages", cid);

    const message = {
        messageId: Date.now(),
        from,
        to,
        text,
        attachments,
        type,
        timestamp: new Date().toISOString(),
        status: {
            sentToUser: false,
            deliveredToUser: false,
            seenByuser: false
        },
        deliveredAt: null,
        seenAt: null
    };

    if (!messages || !messages.value || messages.value.length < 1) {
        messages = {
            id: cid,
            value: []
        }
    }

    messages.value.push(message);

    setData("messages", messages, cid);

    return message;
}
