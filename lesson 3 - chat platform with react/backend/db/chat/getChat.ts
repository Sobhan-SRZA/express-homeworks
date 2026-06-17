import getData from "../../database/commands/getData";

export default function (userId: string) {
    try {
        const chats = getData("chats", userId)?.value || [];

        return chats;
    }

    catch (e) {
        console.error("Getting chats has problem:", e);

        return null;
    }
}