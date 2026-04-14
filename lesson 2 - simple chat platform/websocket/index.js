const http = require('http');
const WebSocket = require('ws')
const ws_port = 3000;
const url = require('url');
const { verifyToken } = require('../utils/security');
const searchAccounts = require('../db/account/searchAccounts');
const getAccount = require('../db/account/getAccount');
const addMessage = require('../db/messages/addMessage');
const getHistory = require('../db/messages/getHistory');
const setOnline = require('../db/users/setOnline');
const broadcast = require('../utils/broadcast');
const setOffline = require('../db/users/setOffline');

/**
 * 
 * @param {import("express").Express} app 
 */
module.exports = (app) => {
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server, path: '/ws' }); // مسیر WebSocket


    // map از کاربران آنلاین
    // key = userId , value = wsClient
    const onlineUsers = new Map();


    wss.on('connection', async (ws, req) => {
        console.log('the WebSocket client is connected');

        // ------ احراز هویت با توکن ------
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

            console.log(`user "${currentUser.username}" is connected.`);
            ws.user = currentUser;

            // هنگامی که کاربر وصل شد:
            await setOnline(currentUser.id);

            onlineUsers.set(currentUser.id, ws);

            broadcast({
                type: "user_online",
                payload: { userId: currentUser.id }
            });

            // ------ مدیریت جستجو ------
            ws.on('message', async (message) => {
                const parsedMessage = JSON.parse(message);

                if (parsedMessage.type === "get_user_status") {
                    const { userId } = parsedMessage.payload;
                    const status = await getUserStatus(userId);

                    ws.send(JSON.stringify({
                        type: "user_status",
                        payload: status
                    }));
                }

                else if (parsedMessage.type === 'search_user') {
                    const { query } = parsedMessage.payload;
                    console.log(`جستجو برای: ${query} از کاربر: ${currentUser.username}`);

                    // اینجا کوئری دیتابیس رو اجرا کن
                    const foundUsers = await searchAccounts(query);

                    ws.send(JSON.stringify({
                        type: 'search_results', payload: foundUsers
                    }));
                }

                else if (parsedMessage.type === 'open_chat') {
                    const { userId } = parsedMessage.payload;
                    console.log(`کاربر ${currentUser.username} صفحه چت با ${userId} را باز کرد.`);
                    const targetUser = await getAccount(userId);
                    ws.send(JSON.stringify({ type: 'chat_opened', payload: targetUser }));
                }

                // ------ ارسال پیام (پیاده‌سازی در مرحله بعد) ------
                else if (parsedMessage.type === 'send_message') {
                    const { to, text } = parsedMessage.payload;
                    console.log(`message from ${currentUser.username} to ${to}: ${text}`);

                    const savedMessage = await addMessage(currentUser.id, to, text);
                    const targetClient = onlineUsers.get(to);

                    if (targetClient) {
                        targetClient.send(JSON.stringify({
                            type: 'new_message',
                            payload: savedMessage
                        }));
                    }

                    ws.send(JSON.stringify({
                        type: 'message_sent_ack',
                        payload: savedMessage
                    }));
                }

                // ------ وضعیت تایپ (پیاده‌سازی در مرحله بعد) ------
                else if (parsedMessage.type === 'typing') {
                    // ...
                }

                else if (parsedMessage.type === 'get_history') {
                    const { with: otherUser } = parsedMessage.payload;

                    const history = await getHistory(currentUser.id, otherUser);

                    ws.send(JSON.stringify({
                        type: "chat_history",
                        payload: {
                            with: otherUser,
                            messages: history
                        }
                    }));
                }

            });

            ws.on("close", async () => {
                onlineUsers.delete(currentUser.id);

                console.log('WebSocket client was disconnected! : ', currentUser.id);

                // 1) ثبت آفلاین شدن + لست سین
                await setOffline(currentUser.id);

                // 2) ارسال رویداد آفلاین شدن
                broadcast({
                    type: "user_offline",
                    payload: {
                        userId: currentUser.id,
                        lastSeen: new Date().toISOString()
                    }
                });
            });

            ws.on('error', (error) => {
                console.error('خطای WebSocket:', error);
            });

            // ارسال پیام تایید اتصال به کلاینت
            ws.send(JSON.stringify({ type: 'connected', payload: currentUser }));
        }

        catch (err) {
            console.error("Authentication failed:", err.message);
            ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
            ws.close();
        }
    });

    function broadcast(data) {
        const json = JSON.stringify(data);
        for (const client of onlineUsers.values()) {
            client.send(json);
        }
    }

    server.listen(ws_port, () => {
        console.log(`سرور HTTP و WebSocket روی پورت ${ws_port} در حال اجراست.`);
    });
}