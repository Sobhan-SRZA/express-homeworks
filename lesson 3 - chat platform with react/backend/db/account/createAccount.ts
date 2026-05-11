import generateId from "../../utils/generateId";
import setData from "../../database/commands/setData";
import getData from "../../database/commands/getData";

export default (username: string, hashedPassword: string) => {
    try {
        const timestamp = Date.now();
        const userId = generateId()!;

        const accounts = getData("accounts");
        accounts.push({
            id: userId,
            value: {
                created_at: timestamp,
                username,
                id: userId,
                password: hashedPassword
            }
        });

        setData("accounts", accounts);

        return {
            created_at: timestamp,
            username,
            id: userId
        };
    }

    catch (error) {
        console.log("Error creating account from database:", error)

        return null;
    }
}