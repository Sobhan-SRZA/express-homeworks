import getData from "../../database/commands/getData";
import checkUsername from "./checkUsername";
import getAccount from "./getAccount";

export default (userId: string, username?: string, hashedPassword?: string) => {
    try {
        const accounts = getData("accounts");

        const account = getAccount(userId);

        if (!account) {
            throw ("Account was not found!")
        }

        if (username) {
            if (checkUsername(username)) {
                throw ("The username was used before!")
            }

            account.username = username;

            setData("accounts", accounts);

            return true;
        }

        if (hashedPassword) {
            account.password = hashedPassword;

            setData("accounts", accounts);

            return true;
        }

        return false;
    }

    catch (e) {
        console.error("Error editing account from database:", e)

        return false;
    }
}