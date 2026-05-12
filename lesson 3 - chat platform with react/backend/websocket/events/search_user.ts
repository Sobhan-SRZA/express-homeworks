import { UserTokenVerify } from "../../types/user";
import { CustomSocket } from "../../types/requests";
import searchAccounts from "../../db/account/searchAccounts";

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