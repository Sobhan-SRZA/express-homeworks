import { UserStatus } from "../../database/commands/types";
import getAccount from "../account/getAccount";
import getData from "../../database/commands/getData";

export default function (userId: string): UserStatus | null {
    try {
        const account = getAccount(userId);
        if (!account) {
            throw "Account was not found."
        }

        const users = getData("users");
        const userStatusData = users.find(a => a.id === `${account.id}`);

        const online = userStatusData?.value?.online || false;
        const lastSeen = userStatusData?.value?.lastSeen || null;

        return { userId, online, lastSeen };
    }

    catch (e) {
        console.error("Getting the user status has problem:", e)

        return null;
    }
}