import {
    handleEvent,
    loadEventHandlers
} from "./eventHandler";
import { CustomSocket } from "../types/requests";
import { createServer } from "http";
import { verifyToken } from "../utils/security";
import { OnlineUsers } from "../types/user";
import { Express } from "express";
import { Server } from "socket.io";
import getUserStatus from "../db/users/getUserStatus";
import getAccount from "../db/account/getAccount";
import setOffline from "../db/users/setOffline";
import setOnline from "../db/users/setOnline";

const ws_port = 3000;

export default (app: Express) => {
    const FRONT_URL = process.env.FRONT_URL;

    if (!FRONT_URL) {
        throw "You didn't add FRONT_URL to .env file."
    }

    const server = createServer(app);

    const io = new Server(server, {
        cors: {
            origin: [FRONT_URL]
        }
    });

    const onlineUsers: OnlineUsers = new Map(); // { userId: socket }

    io.use((socket: CustomSocket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Token missing"));
        }

        try {
            const currentUser = verifyToken(token);

            if (!currentUser || currentUser.expire < Date.now()) {
                return next(new Error("Invalid token"));
            }

            const isValidAccount = getAccount(currentUser.id);
            if (!isValidAccount) {
                return next(new Error("Invalid account"));
            }

            socket.user = currentUser;
            next();
        }

        catch (err) {
            return next(new Error("Authentication failed"));
        }
    });

    io.on("connection", async (socket: CustomSocket) => {
        const currentUser = socket.user;
        const userId = currentUser!.id;

        await loadEventHandlers();

        socket.on("event", (data) => {
            handleEvent(socket, data, userId, currentUser, onlineUsers);
        });

        console.log("✅ Socket connected:", userId);

        setOnline(userId);
        onlineUsers.set(userId, socket);

        io.emit("user_status", getUserStatus(userId));

        socket.on("disconnect", () => {
            onlineUsers.delete(userId);

            console.log("❌ Socket disconnected:", userId);

            setOffline(userId);

            io.emit("user_status", getUserStatus(userId));
        });

        socket.emit("connected", currentUser);
    });

    server.listen(ws_port, () => {
        console.log(`✅ HTTP & Socket.IO running on http://localhost:${ws_port}`);
    });
};