const { verifyToken } = require('../utils/security');
const getUserStatus = require('../db/users/getUserStatus');
const setOffline = require('../db/users/setOffline');
const getAccount = require('../db/account/getAccount');
const setOnline = require('../db/users/setOnline');
const { Server, Socket } = require('socket.io')
const http = require('http');
const url = require('url');
const fs = require('fs');

const ws_port = 3000;

/**
 * 
 * @param {import("express").Express} app 
 * @returns {void}
 */
module.exports = (app) => {
    const server = http.createServer(app);
    const io = new Server({ ...server, path: '/ws' });

    /**
     * @type {Map<string, Socket>}
     */
    const onlineUsers = new Map(); // { userId: wsClient }
    const userMessageMap = new Map(); // { userId: Set<messageId> } 

    io.on('connection', async (socket) => {

        const query = url.parse(socket.request.url, true).query;
        const token = query.token;

        if (!token) {
            console.error("Authentication error: Token missing");
            socket.send(JSON.stringify({
                type: "error",
                code: "AUTH_MISSING",
                message: "Token is missing"
            }));

            io.close();

            return;
        }

        try {
            const currentUser = verifyToken(token);

            const isValidAccount = getAccount(currentUser.id);
            if (!currentUser || currentUser.expire < Date.now() || !isValidAccount) {
                socket.send(JSON.stringify({
                    type: "error",
                    code: "AUTH_EXPIRE",
                    message: 'Token is invalid please login again!'
                }));

                io.close();

                return;
            }

            console.log('the WebSocket client is connected:', currentUser.id);

            socket.user = currentUser;
            const senderId = currentUser.id;

            setOnline(senderId);

            onlineUsers.set(senderId, socket);
            userMessageMap.set(senderId, new Set());

            broadcast({ type: 'user_status', payload: getUserStatus(senderId) });

            socket.on('message', async (message) => {
                const parsedMessage = JSON.parse(message);

                fs
                    .readdirSync("websocket/events")
                    .filter(file => file.endsWith(".js"))
                    .forEach(async (file) => {
                        const fileEvent = file.replace(".js", "");

                        if (parsedMessage.type === fileEvent) {
                            const eventHandle = require(`./events/${file}`);

                            await eventHandle(socket, parsedMessage, senderId, currentUser, onlineUsers, userMessageMap)
                        }
                    })

            });

            socket.on("close", async () => {
                onlineUsers.delete(senderId);

                console.log('WebSocket client was disconnected!: ', senderId);

                setOffline(senderId);

                broadcast({ type: 'user_status', payload: getUserStatus(senderId) });
            });

            socket.on('error', (error) => {
                console.error('خطای WebSocket:', error);
            });

            socket.send(JSON.stringify({ type: 'connected', payload: currentUser }));

            /**
             * 
             * @param {object} data 
             * @returns {void}
             */
            function broadcast(data) {
                const json = JSON.stringify(data);
                for (const client of onlineUsers.values()) {
                    client.send(json);
                }

                return;
            }
        }

        catch (err) {
            console.error("Authentication failed:", err);

            socket.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
            io.close();
        }
    });

    server.listen(ws_port, () => {
        console.log(`the server HTTP and WebSocket is run on port ${ws_port}: http://localhost:${ws_port}`);
    });
}