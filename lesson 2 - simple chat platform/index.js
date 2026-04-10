const express = require("express");
const fs = require("fs")

const http = require('http');
const WebSocket = require('ws')

const port = 8888;
const ws_port = 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Use json in express get and post
app.use(express.json());

// Load static files path
app.use(express.static(__dirname + "/public"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' }); // مسیر WebSocket
wss.on('connection', async (ws, req) => {
    console.log('کلاینت WebSocket متصل شد');

    // ------ احراز هویت با توکن ------
    const token = req.headers['authorization']?.split(' ')[1]; // فرض می‌کنیم توکن در هدر Authorization فرستاده شده
    if (!token) {
        console.error("Authentication error: Token missing");
        ws.send(JSON.stringify({ type: 'auth_error', message: 'Token missing' }));
        ws.close();
        return;
    }

    try {
        // const decodedUser = await verifyToken(token); // تابع وریفای توکن شما
        // اگر توکن معتبر نبود:
        // ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
        // ws.close();
        // return;

        // فرض می‌کنیم کاربر معتبر است
        const currentUser = { id: 'user_abc', username: 'test_user' }; // اطلاعات نمونه کاربر

        console.log(`کاربر ${currentUser.username} متصل شد.`);
        ws.user = currentUser; // اطلاعات کاربر رو به کانکشن اضافه می‌کنیم

        // ------ مدیریت جستجو ------
        ws.on('message', (message) => {
            const parsedMessage = JSON.parse(message);

            if (parsedMessage.type === 'search_user') {
                const { query } = parsedMessage.payload;
                console.log(`جستجو برای: ${query} از کاربر: ${currentUser.username}`);

                // اینجا کوئری دیتابیس رو اجرا کن
                const foundUsers = [
                    { id: 'user123', username: 'ali_rezaei', name: 'علی رضایی', avatar: '/path/to/ali.jpg' },
                    { id: 'user456', username: 'sara_jafari', name: 'سارا جعفری', avatar: '/path/to/sara.jpg' },
                ];
                ws.send(JSON.stringify({ type: 'search_results', payload: foundUsers }));
            }

            else if (parsedMessage.type === 'open_chat') {
                const { userId } = parsedMessage.payload;
                console.log(`کاربر ${currentUser.username} صفحه چت با ${userId} را باز کرد.`);
                const targetUser = {
                    id: 'user123', username: 'ali_rezaei', name: 'علی رضایی', avatar: '/path/to/ali.jpg',
                    lastSeen: 'آنلاین', bio: 'برنامه‌نویس'
                };
                ws.send(JSON.stringify({ type: 'chat_opened', payload: targetUser }));
            }

            // ------ ارسال پیام (پیاده‌سازی در مرحله بعد) ------
            else if (parsedMessage.type === 'send_message') {
                const { to, text } = parsedMessage.payload;
                console.log(`پیام از ${currentUser.username} به ${to}: ${text}`);
                // اینجا باید پیام رو در دیتابیس ذخیره کنی
                // و بعد به کاربر مقصد بفرستی
                // برای پیدا کردن کلاینت مقصد، باید یک مپ از کاربران متصل داشته باشیم
                // const targetClient = findClientByUserid(to);
                // if (targetClient) {
                //    targetClient.send(JSON.stringify({ type: 'new_message', payload: { from: currentUser, text, timestamp: new Date() } }));
                // }
                // فعلا به خود فرستنده پیام رو برمی‌گردونیم
                ws.send(JSON.stringify({ type: 'message_sent_ack', payload: { id: Date.now(), text, timestamp: new Date(), status: 'sent' } }));
            }

            // ------ وضعیت تایپ (پیاده‌سازی در مرحله بعد) ------
            else if (parsedMessage.type === 'typing') {
                // ...
            }
        });

        ws.on('close', () => {
            console.log('کلاینت WebSocket قطع شد');
            // اینجا باید وضعیت کاربر رو آپدیت کنی (مثلا آفلاین)
        });

        ws.on('error', (error) => {
            console.error('خطای WebSocket:', error);
        });

        // ارسال پیام تایید اتصال به کلاینت
        ws.send(JSON.stringify({ type: 'connected', payload: { userId: currentUser.id } }));
    } catch (err) {
        console.error("Authentication failed:", err.message);
        ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
        ws.close();
    }
});

server.listen(ws_port, () => {
    console.log(`سرور HTTP و WebSocket روی پورت ${ws_port} در حال اجراست.`);
});

fs.readdirSync("./api")
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
        const fileCode = require(`./api/${file}`)
        const fileName = file.split(".")[0];

        app.use(`/api/${fileName}`, fileCode)
    })

// Load all pages from ./pages
fs.readdirSync("./pages")
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
        const fileCode = require(`./pages/${file}`)

        fileCode(app)
    })

// Redirect all invalid url to /404
app.get("*", (req, res) => {
    res.redirect("/404")
})

app.listen(
    port,

    (e) => {
        console.log('App started:', `http://localhost:${port}`);
    }
)