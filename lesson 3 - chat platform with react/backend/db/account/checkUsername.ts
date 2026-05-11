import getData from "../../database/commands/getData";

export default (username: string) => {
    const accounts = getData("accounts");

    if (!accounts || !Array.isArray(accounts) || accounts.length < 1)
        return false;

    const usernames = accounts.map(a => a.value.username.toLowerCase());

    if (usernames.includes(username.toLowerCase()))
        return true;

    return false;
}