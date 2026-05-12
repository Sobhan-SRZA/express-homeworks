import searchAccounts from "../../db/account/searchAccounts";
import { CustomSocket } from "../../types/requests";
import { UserTokenVerify } from "../../types/user";

export default (socket: CustomSocket, payload: any, senderId: string, currentUser: UserTokenVerify) => {
    const { query, size } = payload;
    console.log(`searching: ${query} from: ${currentUser.username}`);

    const foundUsers = searchAccounts(query);

    socket.emit('search_results', {
        foundUsers,
        size
    });

    return;
}