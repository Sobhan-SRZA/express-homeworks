const { verifyToken } = require('../utils/security');
const getUserStatus = require('../db/users/getUserStatus');
const setOffline = require('../db/users/setOffline');
const getAccount = require('../db/account/getAccount');
const setOnline = require('../db/users/setOnline');

const http = require('http');
const { Server } = require("socket.io");

const ws_port = 3000;

/**
 * @param {import("express").Express} app 
 */
module.exports = (app) => {
    const FRONT_URL = process.env.FRONT_URL;

    if(!FRONT_URL){
        throw "You didn't add FRONT_URL to .env file."
    }

    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: [FRONT_URL] 
        }
    });

    const onlineUsers = new Map(); // { userId: socket }

    io.use((socket, next) => {
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

    // ✅ اتصال موفق
    io.on("connection", (socket) => {

        const currentUser = socket.user;
        const userId = currentUser.id;

        console.log("✅ Socket connected:", userId);

        setOnline(userId);
        onlineUsers.set(userId, socket);

        // broadcast وضعیت آنلاین
        io.emit("user_status", getUserStatus(userId));

        // ✅ جایگزین message event
        socket.on("event", async (data) => {
            const { type, payload } = data;

            const fs = require('fs');

            fs
                .readdirSync("websocket/events")
                .filter(file => file.endsWith(".js"))
                .forEach(async (file) => {

                    const fileEvent = file.replace(".js", "");

                    if (type === fileEvent) {
                        const eventHandle = require(`./events/${file}`);

                        await eventHandle(
                            socket,
                            payload,
                            userId,
                            currentUser,
                            onlineUsers
                        );
                    }
                });
        });

        // ✅ disconnect
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
