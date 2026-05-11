import getAccount from "./getAccount";
import getData from "../../database/commands/getData";

export default (userId: string) => {
    try {
        const accounts = getData("accounts");

        const account = getAccount(userId);
        if (account) {
            setData("accounts", accounts.filter(a => a.id !== account.id));

            return true;
        }

        console.log("Error deleting account from database: Account with id ", userId, " was not founded.")
        
        return false;

    }

    catch (error) {
        console.log("Error deleting account from database:", error)

        return false;
    }
}