// ... (کدهای قبلی اتصال WebSocket و ... )

const fs = require('fs');
const path = require('path');

// توابع فرضی برای دیتابیس
const addMessage = require("../../db/messages/addMessage");
const addFileRecord = require("../../db/files/addFileRecord"); // تابعی برای ذخیره اطلاعات فایل در دیتابیس
const updateMessageStatus = require("../../db/messages/updateMessageStatus");
const getFileRecord = require('../../db/files/getFileRecord');

const messageTypes = [
    "text",
    "emoji",
    "image",
    "video",
    "voice",
    "music",
    "file",
    "file_upload", // نوع جدید برای آپلود فایل
    "file_message" // نوع جدید برای پیام حاوی فایل(ها)
];

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads'); // پوشه ذخیره فایل‌ها

// اطمینان از وجود پوشه uploads
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

/**
 * @param {WebSocket} ws
 * @param {{ type: string, payload: any }} parsedMessage
 * @param {string} senderId
 * @param {{ username: string, id: string }} currentUser
 * @param {Map<string, WebSocket>} onlineUsers
 */
module.exports = async (ws, parsedMessage, senderId, currentUser, onlineUsers) => {
    const { type, payload } = parsedMessage;

    if (!messageTypes.includes(payload.type)) {
        return ws.send(JSON.stringify({
            type: 'message_error',
            message: 'Invalid message type'
        }));
    }

    switch (type) {
        case 'file_upload':
            await handleFileUpload(ws, payload, senderId, currentUser);
            break;

        case 'send_message':
            await handleSendMessage(ws, payload, senderId, currentUser, onlineUsers);
            break;

        default:
            console.warn(`Unhandled message type: ${type}`);
            break;
    }
};

async function handleFileUpload(ws, payload, senderId, currentUser) {
    const { fileName, fileType, fileContent, fileId: clientFileId } = payload;

    try {
        // حذف پیشوند data:mime/type;base64,
        const base64Data = fileContent.split(',')[1];
        if (!base64Data) {
            throw new Error("Invalid Base64 content");
        }

        // ایجاد نام فایل منحصر به فرد
        const fileExtension = path.extname(fileName);
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
        const filePath = path.join(UPLOADS_DIR, senderId, uniqueFileName);

        // ذخیره فایل
        await fs.promises.writeFile(filePath, base64Data, 'base64');

        // ذخیره اطلاعات فایل در دیتابیس
        const fileRecord = {
            originalName: fileName,
            storedName: uniqueFileName,
            filePath: `/uploads/${senderId}/${uniqueFileName}`, // مسیر قابل دسترسی از طریق API یا CDN
            type: fileType,
            size: Buffer.from(base64Data, 'base64').length,
            uploadedBy: senderId,
            uploadTime: new Date()
        };
        const savedFile = await addFileRecord(fileRecord); // تابع شما برای ذخیره در دیتابیس

        console.log(`File uploaded and saved: ${fileName} as ${uniqueFileName}`);

        // ارسال تأیید موفقیت به فرانت‌اند
        ws.send(JSON.stringify({
            type: 'upload_success',
            payload: {
                fileDetails: savedFile, // اطلاعات کامل فایل ذخیره شده در دیتابیس
                fileId: clientFileId     // ارجاع به فایل در صف آپلود فرانت‌اند
            }
        }));

    } catch (error) {
        console.error("Error handling file upload:", error);
        ws.send(JSON.stringify({
            type: 'upload_error',
            payload: {
                message: error.message || 'Failed to upload file',
                fileId: clientFileId // برای اینکه فرانت‌اند بداند کدام فایل خطا داده
            }
        }));
    }
}

async function handleSendMessage(ws, payload, senderId, currentUser, onlineUsers) {
    const { to, text, type, attachments, timestamp, originalMessageId } = payload; // payload می‌تواند انواع مختلفی داشته باشد

    let savedMessage;
    let messageTypeToSend = type; // نوع پیام اصلی

    try {
        if (type === 'file_message' && attachments && attachments.length > 0) {
            // پیام حاوی فایل(ها)
            messageTypeToSend = 'file_message'; // یا 'media' بسته به دسته‌بندی شما
            // اطلاعات فایل‌ها در attachments هستند (که از دیتابیس برگشته‌اند)
            // شما اینجا فقط شناسه فایل‌ها را در پیام ذخیره می‌کنید
            const attachmentIds = attachments.map(att => att.id); // فرض می‌کنیم attachments شامل id دیتابیس فایل است

            savedMessage = addMessage(senderId, to, text, messageTypeToSend, attachmentIds, timestamp);

        }

        else if (type === 'text' || type === 'emoji') {
            // پیام متنی یا اموجی
            savedMessage = addMessage(senderId, to, text, type, null, timestamp);

        }

        else {
            if (payload.fileId) {
                savedMessage = addMessage(senderId, to, text || payload.fileName, type, [payload.fileId], timestamp);
            }

            else {
                throw new Error("Invalid message payload for type: " + type);
            }
        }

        // ارسال ACK به فرستنده
        ws.send(JSON.stringify({
            type: 'message_sent_ack',
            payload: {
                originalMessageId: originalMessageId || savedMessage.messageId, // اگر فرانت‌اند ID را فرستاده
                messageId: savedMessage.messageId,
                sentAt: savedMessage.timestamp
            }
        }));

        // ارسال پیام به گیرنده
        const targetClient = onlineUsers.get(to);
        if (targetClient) {
            // باید مطمئن شویم پیام دریافتی حاوی اطلاعات فایل است (اگر نوعش file_message است)
            if (savedMessage.attachments && savedMessage.attachments.length > 0) {
                // باید اطلاعات کامل فایل‌ها را از دیتابیس دوباره بخوانیم تا به گیرنده بفرستیم
                const fullAttachments = await Promise.all(savedMessage.attachments.map(fileId => getFileDetailsFromDB(fileId))); // تابعی برای خواندن جزئیات فایل
                savedMessage.attachments = fullAttachments.filter(Boolean); // حذف فایل‌های ناموفق
            }

            targetClient.send(JSON.stringify({
                type: 'new_message',
                payload: savedMessage
            }));

            // به‌روزرسانی وضعیت به Delivered
            updateMessageStatus(to, senderId, savedMessage.messageId, 'delivered');
            targetClient.send(JSON.stringify({
                type: 'message_delivered_notification',
                payload: { messageId: savedMessage.messageId }
            }));
        }

        else {
            // اگر کاربر آفلاین بود، وضعیت فقط Sent می‌ماند
            console.log(`User ${to} is offline. Message will be delivered later.`);
        }

    }

    catch (error) {
        console.error("Error sending message:", error);
        ws.send(JSON.stringify({
            type: 'message_error',
            payload: {
                message: error.message || 'Failed to send message',
                originalMessageId: originalMessageId // اگر پیام ارسالی از فرانت بود
            }
        }));
    }
}

// تابع فرضی برای دریافت جزئیات فایل از دیتابیس
async function getFileDetailsFromDB(fileId) {
    // این تابع باید به دیتابیس شما متصل شود و اطلاعات فایل را بر اساس fileId برگرداند
    // return await FileModel.findById(fileId); // مثال با MongoDB
    console.log(`Fetching details for file ID: ${fileId}`);
    // return { id: fileId, originalName: "example.pdf", filePath: "/uploads/example.pdf", size: 1024, type: "application/pdf" }; // مثال Mock
    // فرض می‌کنیم تابع addFileRecord قبلا اطلاعات را با id ذخیره کرده
    // و این تابع همان اطلاعات را برمی‌گرداند
    return getFileRecord(fileId); // فرض می‌کنیم این تابع وجود دارد
}

// فرض می‌کنیم تابع addFileRecord شما چیزی شبیه این برمی‌گرداند:
// async function addFileRecord(record) { return { id: uuidv4(), ...record }; }
// و تابع getFileRecordById هم آن را بازیابی می‌کند.
