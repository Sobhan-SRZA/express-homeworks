const socketUrl = `http://localhost:3000/ws`;

let filesToUpload = [];

let currentUser = null;
let currentChat = null;
let socket = null;

let debounceTimer;
let typingTimer = null;

const token = localStorage.getItem('token');

const mainUserName = document.getElementById('main-user-name');
const searchInput = document.getElementById('search-input');
const chatList = document.getElementById('chat-list');
const viewProfileBtn = document.getElementById('view-profile-btn');
const recipientName = document.getElementById('recipient-name');
const recipientStatus = document.getElementById('recipient-status');
const messageContainer = document.getElementById('message-container');
const uploadProgressContainer = document.getElementById('upload-progress-container');
const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('message-input');
const messageAttachment = document.getElementById('message-attachment');
const profileModal = document.getElementById('profile-modal');
const closeModalBtn = profileModal.querySelector('.close-button');
const modalProfileName = document.getElementById('modal-profile-name');
const modalProfileUsername = document.getElementById('modal-profile-username');
const modalProfileCreatedAt = document.getElementById('modal-profile-craetedat');
const chatWindowContent = document.getElementById('chat-window-content');
const noChatSelectedMessage = document.getElementById('no-chat-selected-message');


/**
 * 
 * @param {boolean} showChat 
 */
function toggleChatWindow(showChat) {
    if (showChat) {
        chatWindowContent.style.display = 'flex';
        noChatSelectedMessage.style.display = 'none';
    }

    else {
        chatWindowContent.style.display = 'none';
        noChatSelectedMessage.style.display = 'block';
    }
}

/**
 * 
 */
function connectWebSocket() {
    socket = new WebSocket(`${socketUrl}?token=${token}`);

    console.log("WebSocket connection...");

    socket.onopen = () => {
        console.log('WebSocket connection established');
        socket.send(JSON.stringify({ type: 'get_initial_data' }));
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message from server:', message);

        switch (message.type) {
            case 'connected':
                // load user
                currentUser = message.payload;

                viewProfileBtn.innerText = currentUser.username;

                console.log('Server acknowledged connection. User ID:', currentUser.id);

                document.getElementById('modal-profile-username').textContent = currentUser.username || 'نا مشخص';

                break;

            case 'auth_error':
                console.error('Authentication Error:', message.message);

                alert('خطا در احراز هویت. لطفاً دوباره وارد شوید.');
                localStorage.removeItem('token');
                window.location.href = '/';

                break;

            case 'search_results':
                if (message.size === 1) {
                    currentChat = message.payload[0];

                    if (currentChat) {
                        openChat(currentChat);
                    }

                    else {
                        toggleChatWindow(false);
                    }
                }

                else {
                    displaySearchResults(message.payload);
                }

                break;

            case 'chat_opened':
                currentChat = message.payload;

                break;

            case 'chat_history':
                loadChatHistory(message.payload.messages)

                break;

            case 'new_message':
                const isCurrentUserMessage = message.payload.from === currentUser.id;
                if (isCurrentUserMessage || message.payload.to === currentUser.id) {
                    if (message.payload.from === currentChat.id || isCurrentUserMessage) {
                        displayMessage(message.payload, isCurrentUserMessage);
                    }

                    else {
                        showNotification(message.payload.senderName || 'کاربر', message.payload.text);
                    }
                }

                break;

            case 'message_sent_ack':
                const { originalMessageId, message: orginalMessage } = message.payload;

                messageContainer.childNodes.forEach(msg => {
                    console.log("🚀 ~ connectWebSocket ~ msg.dataset.messageId:", msg.dataset.messageId)
                    console.log("🚀 ~ connectWebSocket ~ msg.dataset['message-id']:", msg.dataset['message-id'])
                    if (msg.dataset.messageId === originalMessageId) {

                        console.log(`🚀 ~ connectWebSocket ~ msg.getElementById("message-status"):`, msg.getElementById("message-status"))
                        if (deliveredAt) {
                            msg.getElementById("message-status").innerText = "✓✓"
                            msg.classList.add("received")
                        }

                        else {
                            msg.getElementById("message-status").innerText = "✓✓"
                            msg.classList.add("seen")
                        }

                    }
                })

                break;

            case 'typing_indicator':
                break;

            case 'user_profile':
                break;

            case 'user_status': {
                const { userId, online, lastSeen } = message.payload;

                if (currentChat && `${userId}` === `${currentChat.id}`) {
                    currentChat.status = online ? "آنلاین" : "آفلاین";
                    recipientStatus.classList.add(online ? "status-online" : "status-offline");
                    recipientStatus.innerText = currentChat.status;
                    if (lastSeen)
                        currentChat.lastSeen = new Date(lastSeen);
                }
                break
            }

            case 'message_delivered_notification':
            case 'message_sent_notification':
            case 'message_seen_notification': {
                const { userId, messageId, deliveredAt, seenAt } = message.payload;
                messageContainer.childNodes.forEach(msg => {
                    if (`${msg.dataset.messageId}` === `${messageId}` && currentUser.id === `${userId}`) {

                        console.log("🚀 ~ connectWebSocket ~ msg:", msg)
                        let messageStatus = msg.querySelector(".message-status");
                        if (!messageStatus) {
                            const messageStatusElement = document.createElement('div');

                            messageStatusElement.classList.add("message-status");
                            messageStatusElement.innerText = "✓";
                            msg.appendChild(messageStatusElement);
                            messageStatus = messageStatusElement;
                        }

                        if (deliveredAt) {
                            messageStatus.innerText = "✓✓"
                            msg.classList.add("received")
                        }

                        else {
                            messageStatus.innerText = "✓✓"
                            msg.classList.add("seen")
                        }

                    }
                })

                break;
            }
        }
    };

    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        recipientStatus.textContent = 'قطع شد';

        setTimeout(connectWebSocket, 5000);
    };
}

/**
 * 
 * @param {{ username: string; id: string; }[]} users 
 * @returns 
 */
function displaySearchResults(users) {
    chatList.innerHTML = '';
    users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.classList.add('chat-item');
        listItem.dataset.userId = user.id;
        listItem.dataset.username = user.username;
        listItem.innerHTML = `
            <div class="chat-avatar"></div>
            <div class="chat-info">
                <h4 class="chat-name">${user.username}</h4>
                <p class="chat-status${user.status ? " status-online" : " status-offline"}">${user.status ? "آنلاین" : "آفلاین" || '...'}</p>
            </div>
        `;

        listItem.addEventListener('click', () => openChat(user));
        chatList.appendChild(listItem);
    });

    return
}

function openChat(user) {
    toggleChatWindow(true);

    console.log(`Opening chat with user: ${user.id}`);

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'open_chat', payload: { userId: user.id } }));
        socket.send(JSON.stringify({ type: 'get_chat_history', payload: { with: user.id } }));
        socket.send(JSON.stringify({ type: 'get_user_status', payload: { userId: user.id } }));
    }

    recipientName.innerText = user.username;
    recipientStatus.classList.add(user.status ? "status-online" : "status-offline");
    recipientStatus.innerText = user.status ? "آنلاین" : "آفلاین";

    const chatUrl = `/chat/${user.username}`;
    if (window.location.pathname !== chatUrl) {
        window.history.pushState({ userId: user.id, username: user.username }, '', chatUrl);
    }

    return;
}


/**
 * 
 * @param {Object} message 
 * @param {boolean} isMyMessage 
 */
function displayMessage(message, isMyMessage) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.dataset.messageId = message.messageId;
    if (isMyMessage) {
        messageElement.classList.add('sent');
    }

    else {
        messageElement.classList.add('received');
    }

    const timestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageElement.innerHTML = `
            <div class="message-content">${message.text}</div>
            <div class="message-timestamp">${timestamp}</div>
            ${isMyMessage ? '<div class="message-status" id="message-status">✓</div>' : ''}
    `;

    messageContainer.appendChild(messageElement);

    return;
}

function loadChatHistory(messages) {
    messageContainer.innerHTML = '';

    messages.forEach(message => {
        displayMessage(message, message.from === currentUser.id)
    })

    messageContainer.scrollTop = messageContainer.scrollHeight;

    return;
}

messageAttachment.addEventListener('change', (event) => {
    const files = Array.from(event.target.files); // تبدیل FileList به آرایه

    files.forEach(file => {
        const fileId = `upload-${Date.now()}-${Math.random().toString(36).substring(7)}`; // یک ID منحصر به فرد برای هر فایل در صف آپلود
        filesToUpload.push({
            id: fileId,
            file: file,
            progress: 0, // درصد آپلود
            status: 'pending' // وضعیت: pending, uploading, completed, failed
        });
        renderUploadProgressItem(fileId, file.name, 0, 'pending');
    });

    event.target.value = ''; // پاک کردن فیلد فایل برای امکان انتخاب دوباره همان فایل‌ها
    uploadProgressContainer.style.display = 'block'; // نمایش ناحیه پیشرفت
});

// تابع برای رندر کردن یک آیتم پیشرفت آپلود
function renderUploadProgressItem(id, fileName, progress, status) {
    const existingItem = document.querySelector(`.upload-progress-item[data-id="${id}"]`);
    if (existingItem) {
        // اگر آیتم از قبل وجود دارد، فقط آن را آپدیت کن
        const progressBar = existingItem.querySelector('.progress-bar');
        const progressText = existingItem.querySelector('.progress-text');
        const fileDetails = existingItem.querySelector('.file-details');

        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
        fileDetails.textContent = `${status === 'completed' ? 'تکمیل شده' : status === 'failed' ? 'خطا' : ''}`;
        // تغییر رنگ نوار پیشرفت بر اساس وضعیت
        if (status === 'failed') {
            progressBar.style.backgroundColor = '#f44336'; // قرمز
            progressText.style.color = '#f44336';
        } else if (status === 'completed') {
            progressBar.style.backgroundColor = '#4CAF50'; // سبز
            progressText.style.color = '#4CAF50';
        } else {
            progressBar.style.backgroundColor = '#4CAF50';
            progressText.style.color = '#4CAF50';
        }
        return;
    }

    // ساختن آیتم جدید
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('upload-progress-item');
    itemDiv.dataset.id = id; // ذخیره ID برای آپدیت‌های بعدی

    // تعیین آیکون بر اساس نوع فایل (می‌توانید با کتابخانه‌ای مثل file-icons یا یک دیکشنری ساده این کار را انجام دهید)
    const fileIcon = getFileIcon(fileName);

    itemDiv.innerHTML = `
        <div class="file-icon">${fileIcon}</div>
        <div class="file-info">
            <div class="file-name">${fileName}</div>
            <div class="file-details">${status === 'pending' ? 'در انتظار...' : ''}</div>
        </div>
        <div class="progress-bar-wrapper">
            <div class="progress-bar" style="width: ${progress}%"></div>
        </div>
        <div class="progress-text">${Math.round(progress)}%</div>
    `;
    uploadProgressContainer.appendChild(itemDiv);
}

function getFileIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return '<i class="fas fa-image"></i>';
        case 'pdf':
            return '<i class="fas fa-file-pdf"></i>';
        case 'doc':
        case 'docx':
            return '<i class="fas fa-file-word"></i>';
        case 'xls':
        case 'xlsx':
            return '<i class="fas fa-file-excel"></i>';
        case 'zip':
        case 'rar':
            return '<i class="fas fa-file-archive"></i>';
        case 'mp4':
        case 'mov':
        case 'avi':
            return '<i class="fas fa-film"></i>';
        default:
            return '<i class="fas fa-file"></i>';
    }
}


function updateFileStatus(fileId, status, progress = null) {
    const fileEntry = filesToUpload.find(f => f.id === fileId);
    if (fileEntry) {
        if (progress !== null) fileEntry.progress = progress;
        fileEntry.status = status;
        renderUploadProgressItem(fileId, fileEntry.file.name, fileEntry.progress, status);
    }
}

function sendMessage() {
    const messageText = messageInput.value.trim();

    const pendingUploads = filesToUpload.filter(f => f.status === 'pending' || f.status === 'uploading');

    if (pendingUploads.length > 0) {
        pendingUploads.forEach(fileEntry => {
            uploadFile(fileEntry);
        });

        if (messageText && currentChat) {
            console.log("Message text will be sent after file uploads are complete.");
        }

        return;
    }

    if (!messageText && filesToUpload.length === 0) {
        console.warn("Nothing to send.");
        return;
    }

    if (filesToUpload.length > 0 && filesToUpload.every(f => f.status === 'completed')) {
        // اینجا باید پیام حاوی اطلاعات فایل‌ها را ارسال کنی
        // مثلاً لیستی از fileIds که در دیتابیس ذخیره شده‌اند
        // این بخش نیاز به تعریف یک نوع پیام جدید برای "ارسال فایل" دارد
        console.log("All files uploaded. Sending message with file references.");
        sendFilesMessage(filesToUpload.map(f => f.fileDetails.id)); // id فایل ذخیره شده در دیتابیس
        filesToUpload = []; // پاک کردن صف فایل‌ها بعد از ارسال
        uploadProgressContainer.style.display = 'none'; // مخفی کردن ناحیه پیشرفت
        messageInput.value = ''; // پاک کردن اینپوت متن
    }

    else if (messageText && currentChat) {
        // ارسال پیام متنی ساده
        const messagePayload = {
            to: currentChat.id,
            text: messageText,
            type: 'text', // نوع پیام متنی
            timestamp: new Date().toISOString()
        };

        const messageElement = createMessageElement(messagePayload); // تابع کمکی برای ساخت المان پیام
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'send_message', payload: messagePayload }));
            messageElement.classList.add('message', 'sent');
            // آپدیت وضعیت پیام به ✓✓ (Sent)
        }

        else {
            console.error("WebSocket is not connected.");
        }

        messageInput.value = '';
    }

    return;
}

function uploadFile(fileEntry) {
    const reader = new FileReader();
    const file = fileEntry.file;

    reader.onloadend = () => {
        const base64Content = reader.result; // این شامل پیشوند data:mime/type;base64, است
        const fileName = file.name;
        const fileType = file.type;
        const fileSize = file.size;

        // برای نمایش پیشرفت، می‌توانیم فایل را به قطعات کوچک‌تر تقسیم کرده و Chunked ارسال کنیم
        // اما برای سادگی، ابتدا Base64 را کامل می‌کنیم و بعد ارسال می‌کنیم
        // در یک سناریوی واقعی، باید از Stream API یا تقسیم‌بندی دستی برای نمایش دقیق پیشرفت استفاده کرد.

        // ارسال پیام با نوع 'file_upload'
        const uploadPayload = {
            type: 'file_upload',
            fileName: fileName,
            fileType: fileType,
            fileSize: fileSize,
            fileContent: base64Content, // یا فقط محتوای بعد از پیشوند
            senderId: currentUser.id, // شناسه کاربر فعلی
            fileId: fileEntry.id // ارجاع به فایل در صف آپلود
        };

        if (socket && socket.readyState === WebSocket.OPEN) {
            updateFileStatus(fileEntry.id, 'uploading', 50); // فرض کنید ۵۰٪ پیشرفت اولیه
            socket.send(JSON.stringify(uploadPayload));
        }

        else {
            updateFileStatus(fileEntry.id, 'failed');
            console.error("WebSocket is not connected. Cannot upload file.");
        }
    };

    reader.onerror = () => {
        updateFileStatus(fileEntry.id, 'failed');
        console.error("Error reading file:", reader.error);
    };

    // خواندن فایل به صورت Data URL (Base64)
    reader.readAsDataURL(file);
}

// تابع کمکی برای ساخت المان پیام (برای جلوگیری از تکرار کد)
function createMessageElement(messagePayload) {
    const messageElement = document.createElement('div');
    const timestamp = new Date(messagePayload.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let contentHtml = '';
    if (messagePayload.type === 'text') {
        contentHtml = `<div class="message-content">${messagePayload.text}</div>`;
    }

    else if (messagePayload.type === 'file' || messagePayload.type === 'image' || messagePayload.type === 'video') {
        // اینجا باید المان مربوط به نمایش فایل را بسازیم
        // مثلاً لینک دانلود یا نمایش تصویر/ویدیو
        contentHtml = `<div class="message-content"><a href="${messagePayload.filePath}" target="_blank">${messagePayload.fileName || 'فایل'}</a></div>`;
        // اگر عکس بود، المان <img>
    }

    else if (messagePayload.type === 'emoji') {
        contentHtml = `<div class="message-content">${messagePayload.emoji}</div>`;
    }
    // ... انواع دیگر پیام‌ها

    messageElement.innerHTML = `
        ${contentHtml}
        <div class="message-timestamp">${timestamp}</div>
        <div class="message-status" id="message-status">✓</div> <!-- وضعیت ارسال -->
    `;
    return messageElement;
}

/**
 * 
 * @param {string} title
 * @param {string} body 
 */
function showNotification(title, body) {
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications!");
    } else if (Notification.permission === "granted") {
        const notification = new Notification(title, {
            body: body
        });

        notification.onclick = () => {
            window.focus();
            console.log("Notification clicked");
        };
    }

    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
                showNotification(title, body);
            }
        });
    }
}

/**
 * 
 * @param {Object} user 
 */
function displayUserProfileModal(user) {
    modalProfileName.innerText = user.name || user.username;
    modalProfileUsername.innerText = user.username;

    const creationDate = new Date(user.created_at);
    modalProfileCreatedAt.innerText = `${creationDate.toISOString()}`;
    profileModal.style.display = "block";
}

searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();
    if (query.length > 1) {
        debounceTimer = setTimeout(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'search_user', payload: { query } }));
            }
        }, 300);
    }

    else {
        displaySearchResults([]);
    }
});


sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

viewProfileBtn.addEventListener('click', () => {
    if (currentUser) {
        displayUserProfileModal(currentUser);
    }
});

closeModalBtn.addEventListener('click', () => {
    profileModal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target === profileModal) {
        profileModal.style.display = "none";
    }
});

window.addEventListener('popstate', (event) => {
    console.log('Pop state:', event.state);
    if (event.state && event.state.userId) {
        openChat({
            id: event.state.userId,
            username: event.state.username,
            name: event.state.username
        });
    }

    else {
        currentChat = null;
        toggleChatWindow(false);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();

    setTimeout(() => {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/chat/')) {
            const username = currentPath.split('/')[2];
            console.log("URL contains chat for:", username);

            socket.send(JSON.stringify({ type: 'search_user', payload: { query: username, size: 1 } }));
        }

        else {
            toggleChatWindow(false);
        }
    }, 100)
});

document.addEventListener('click', () => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
});
