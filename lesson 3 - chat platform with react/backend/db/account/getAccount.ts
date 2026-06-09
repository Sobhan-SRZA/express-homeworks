import getData from "../../database/commands/getData";

export default (userId: string) => {
    try {
        const account = getData("accounts", userId);

        if (!account) {
            throw ("Account with " + userId + " ID didn't founded!");
        }
        
        return account.value;
    }

    catch (e) {
        console.error("Error getting account from database:", e)

        return null;
    }
}