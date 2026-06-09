import getData from "../../database/commands/getData";

export default (username: string) => {
    try {
        const accounts = getData("accounts");

        if (!accounts || !Array.isArray(accounts) || accounts.length < 1) {
            return false;
        }

        const usernames = accounts.map(a => a.value.username.toLowerCase());

        if (usernames.includes(username.toLowerCase())) {
            return true;
        }

        return false;
    }

    catch (e) {
        console.error("Cheking error has problem:", e);

        return false;
    }
}