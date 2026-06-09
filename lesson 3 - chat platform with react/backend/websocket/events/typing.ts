import { CustomSocket } from "../../types/requests";
import getUserStatus from "../../db/users/getUserStatus";

export default (socket: CustomSocket, paylaod: any) => {
    const { userId } = paylaod;
    const status = getUserStatus(userId);
    status!.typing = true;

    socket.emit("typing_indicator", { status });

    return;
}