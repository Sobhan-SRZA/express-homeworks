import getData from "../../database/commands/getData";

export default (search:string) => {
    try {
        if (!search || typeof search !== "string")
            return null;

        const q = search.toLowerCase().trim();

        const accounts = getData("accounts");

        if (!accounts || accounts.length < 1)
            return null;

        // 1. ID exact
        let exactId = accounts.find(a => a.id === search);
        if (exactId)
            return exactId.value;


        // 2. username exact
        let exactUser = accounts.find(a => a.value.username.toLowerCase() === q);
        if (exactUser)
            return exactUser.value;

        // 3. username partial 
        let startsWith = accounts.find(a =>
            a.value.username.toLowerCase().startsWith(q)
        );

        if (startsWith)
            return startsWith.value;


        // 4. username fuzzy
        let contains = accounts.find(a =>
            a.value.username.toLowerCase().includes(q)
        );
        if (contains)
            return contains.value;

        return null;
    }

    catch (e) {
        console.error("Error finding account from database:", e)

        return null;
    }
}