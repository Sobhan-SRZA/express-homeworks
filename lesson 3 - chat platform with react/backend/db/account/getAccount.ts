import getData from "../../database/commands/getData";

export default (userId: string) => {
    try {
        const account = getData("accounts", userId);

        if (!account)
            throw ("Account with " + userId + " ID didn't founded!");

        return account.value;
    }

    catch (error) {
        console.log("Error getting account from database:", error)

        return null;
    }
}