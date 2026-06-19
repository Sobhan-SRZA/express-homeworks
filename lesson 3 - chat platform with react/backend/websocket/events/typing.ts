import {
    OnlineUsers,
    UserTokenVerify
} from "../../types/user";
import { CustomSocket } from "../../types/requests";
import getUserStatus from "../../db/users/getUserStatus";

export default (socket: CustomSocket, payload: any, senderId: string, currentUser: UserTokenVerify, onlineUsers: OnlineUsers) => {
    const { userId } = payload;
    const status = getUserStatus(userId);
    status!.typing = true;

    socket.emit("typing_indicator", { status });

    return;
}