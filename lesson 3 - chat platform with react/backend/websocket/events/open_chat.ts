import { UserTokenVerify } from "../../types/user";
import { CustomSocket } from "../../types/requests";
import getUserStatus from "../../db/users/getUserStatus";
import getAccount from "../../db/account/getAccount";

export default (socket: CustomSocket, payload: any, senderId: string, currentUser: UserTokenVerify) => {
    const { userId } = payload;
    console.log(`user ${currentUser.username} is oppend chat room with ${userId}.`);

    const targetUser = getAccount(userId);
    const status = getUserStatus(userId);

    const user = {
        id: targetUser!.id,
        username: targetUser!.username,
        created_at: targetUser!.created_at,
        status
    }

    socket.emit('chat_opened', { user });

    return;
}