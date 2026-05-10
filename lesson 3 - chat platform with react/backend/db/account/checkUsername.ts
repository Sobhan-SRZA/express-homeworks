import { Database } from "../../types/database";
import getData from "../../database/commands/getData";

export default (username: string) => {
    const accounts = getData("accounts") as Database[];

    if (!accounts || accounts.length < 1)
        return false;

    const usernames = accounts.map(a => a.value.username.toLowerCase());

    if (usernames.includes(username.toLowerCase()))
        return true;

    return false;
}