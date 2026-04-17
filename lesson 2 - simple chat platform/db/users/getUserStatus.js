const getData = require("../../database/commands/getData");
const getAccount = require("../account/getAccount");

/**
 * 
 * @param {string} userId 
 * @returns {{userId:string online:boolean lastSeen:string|null}}
 */
module.exports = function (userId) {
    const account = getAccount(userId);

    const users = getData("users");
    const userStatusData = users.find(a => a.id === `${account.id}`);

    const online = userStatusData.value.online || false;
    const lastSeen = userStatusData.value.lastSeen || null;

    return { userId, online, lastSeen };
}