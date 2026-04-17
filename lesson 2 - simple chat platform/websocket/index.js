const { verifyToken } = require('../utils/security');
const updateMessageStatus = require('../db/messages/updateMessageStatus');
const setOffline = require('../db/users/setOffline');
const setOnline = require('../db/users/setOnline');
const broadcast = require('../utils/broadcast');
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
        console.log('the WebSocket client is connected');

        const query = url.parse(req.url, true).query;
        const token = query.token;

        if (!token) {
            console.error("Authentication error: Token missing");
            ws.send(JSON.stringify({ type: 'auth_error', message: 'Token missing' }));
            ws.close();

            return;
        }

        try {
            const currentUser = verifyToken(token);

            if (!currentUser) {
                ws.send(JSON.stringify({
                    type: 'auth_error',
                    message: 'Invalid token'
                }));

                ws.close();

                return;
            }

            ws.user = currentUser;
            const senderId = currentUser.id;

            await setOnline(senderId);

            onlineUsers.set(senderId, ws);
            userMessageMap.set(senderId, new Set());

            broadcast({
                type: "user_online",
                payload: {
                    id: senderId,
                    username: currentUser.username
                }
            }, onlineUsers);

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

                console.log('WebSocket client was disconnected! : ', senderId);

                await setOffline(senderId);

                broadcast({
                    type: "user_offline",
                    payload: {
                        userId: senderId,
                        lastSeen: new Date().toISOString()
                    }
                }, onlineUsers);
            });

            ws.on('error', (error) => {
                console.error('خطای WebSocket:', error);
            });

            ws.send(JSON.stringify({ type: 'connected', payload: currentUser }));
        }

        catch (err) {
            console.error("Authentication failed:", err.message);
            ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
            ws.close();
        }
    });

    server.listen(ws_port, () => {
        console.log(`the server HTTP and WebSocket is run on port ${ws_port}: http://localhost:${ws_port}`);
    });
}