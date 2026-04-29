const getAccount = require("../account/getAccount");
const getData = require("../../database/commands/getData");
const setData = require("../../database/commands/setData");

/**
 * 
 * @param {string} userId 
 * @returns {{userId:string online:true lastSeen:string}}
 */
module.exports = function (userId) {
    const account = getAccount(userId);

    const users = getData("users");
    let userStatusData = users.find(a => a.id === `${account.id}`);

    if (userStatusData)
        userStatusData.value.online = true;

    else {
        userStatusData = {
            id: `${account.id}`,
            value: {
                online: true,
                lastSeen: null
            }
        };

        users.push(userStatusData);
    };

    setData("users", users);

    return userStatusData.value;
}