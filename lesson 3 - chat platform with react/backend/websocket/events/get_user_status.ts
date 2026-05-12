import { CustomSocket } from "../../types/requests";
import getUserStatus from "../../db/users/getUserStatus";

export default (socket: CustomSocket, payload: any) => {
    const { userId } = payload;
    const status = getUserStatus(userId);

    socket.emit("user_status", {
        status
    });

    return;
}