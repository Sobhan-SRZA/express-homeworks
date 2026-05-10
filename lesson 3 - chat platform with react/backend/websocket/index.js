const { verifyToken } = require('../utils/security');
const getUserStatus = require('../db/users/getUserStatus');
const setOffline = require('../db/users/setOffline');
const getAccount = require('../db/account/getAccount');
const setOnline = require('../db/users/setOnline');
const WebSocket = require('ws')
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
    const wss = new WebSocket.Server({ server, path: '/ws' });

    const onlineUsers = new Map(); // { userId: wsClient }
    const userMessageMap = new Map(); // { userId: Set<messageId> } 

    wss.on('connection', async (ws, req) => {

        const query = url.parse(req.url, true).query;
        const token = query.token;
        console.log("🚀 ~ token:", token)

        if (!token) {
            console.error("Authentication error: Token missing");
            ws.send(JSON.stringify({ type: 'auth_error', message: 'Token missing' }));
            ws.close();

            return;
        }

        try {
            const currentUser = verifyToken(token);

            if (!currentUser || currentUser.expire < Date.now()) {
                ws.send(JSON.stringify({
                    type: 'auth_error',
                    message: 'Invalid token'
                }));

                ws.close();

                return;
            }

            const isValidAccount = getAccount(currentUser.id);
            if (!isValidAccount) {
                ws.send(JSON.stringify({
                    type: 'auth_error',
                    message: 'Invalid token'
                }));

                ws.close();

                return;
            }

            console.log('the WebSocket client is connected:', currentUser.id);

            ws.user = currentUser;
            const senderId = currentUser.id;

            setOnline(senderId);

            onlineUsers.set(senderId, ws);
            userMessageMap.set(senderId, new Set());

            broadcast({ type: 'user_status', payload: getUserStatus(senderId) });

            ws.on('message', async (message) => {
                const parsedMessage = JSON.parse(message);

                fs
                    .readdirSync("websocket/events")
                    .filter(file => file.endsWith(".js"))
                    .forEach(async (file) => {
                        const fileEvent = file.replace(".js", "");

                        if (parsedMessage.type === fileEvent) {
                            const eventHandle = require(`./events/${file}`);

                            await eventHandle(ws, parsedMessage, senderId, currentUser, onlineUsers, userMessageMap)
                        }
                    })

            });

            ws.on("close", async () => {
                onlineUsers.delete(senderId);

                console.log('WebSocket client was disconnected!: ', senderId);

                setOffline(senderId);

                broadcast({ type: 'user_status', payload: getUserStatus(senderId) });
            });

            ws.on('error', (error) => {
                console.error('خطای WebSocket:', error);
            });

            ws.send(JSON.stringify({ type: 'connected', payload: currentUser }));

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

            ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
            ws.close();
        }
    });

    server.listen(ws_port, () => {
        console.log(`the server HTTP and WebSocket is run on port ${ws_port}: http://localhost:${ws_port}`);
    });
}