import getAccount from "../account/getAccount";
import getData from "../../database/commands/getData";
import setData from "../../database/commands/setData";

export default function (userId: string) {
    try {
        const account = getAccount(userId);

        if (!account) {
            throw ("Account with " + userId + " ID didn't founded!");
        }

        const users = getData("users");
        let userStatusData = users.find(a => a.id === `${account.id}`);

        if (userStatusData) {
            userStatusData.value.online = true;
        }

        else {
            userStatusData = {
                id: `${account.id}`,
                value: {
                    userId: account.id,
                    online: true,
                    lastSeen: null
                }
            };

            users.push(userStatusData);
        };

        setData("users", users);

        return userStatusData.value;
    }

    catch (e) {
        console.error("Setting the user status to online has problem:", e)

        return null;
    }
}