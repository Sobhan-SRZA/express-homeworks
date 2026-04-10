document.addEventListener('DOMContentLoaded', () => {
    const socketUrl = 'ws://localhost:3000/ws'; // URL سرور WebSocket (مطمئن شو پورت درست است)
    let socket;
    let debounceTimer;
    let currentChattingWith = null; // ID کاربری که چت با او فعال است
    let typingTimer = null; // برای مدیریت وضعیت typing
    const token = localStorage.getItem('token'); // دریافت توکن از Local Storage

    // --- عناصر DOM ---
    const searchInput = document.getElementById('search-input');
    const chatList = document.getElementById('chat-list');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const messageContainer = document.getElementById('message-container');
    const profileModal = document.getElementById('profile-modal');
    const closeModalBtn = profileModal.querySelector('.close-button');
    const viewProfileBtn = document.getElementById('view-profile-btn');
    const recipientAvatar = document.getElementById('recipient-avatar');
    const recipientName = document.getElementById('recipient-name');
    const recipientStatus = document.getElementById('recipient-status');
    const modalProfileAvatar = document.getElementById('modal-profile-avatar');
    const modalProfileName = document.getElementById('modal-profile-name');
    const modalProfileUsername = document.getElementById('modal-profile-username');
    const modalProfileStatus = document.getElementById('modal-profile-status');
    const modalProfileBio = document.getElementById('modal-profile-bio');

    let currentUserData = null; // اطلاعات کاربر فعلی (سبحان)

    function connectWebSocket() {
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log("Already connected.");
            return;
        }

        console.log(`Connecting to WebSocket at ${socketUrl}...`);
        socket = new WebSocket(socketUrl, JSON.stringify({
            protocols: "connection",
            headers: {
                'Authorization': `Bearer ${token}` // ارسال توکن در هدر
            }
        }));

        socket.onopen = () => {
            console.log('WebSocket connection established');
            // اگر توکن معتبر نبود، احتمالاً اینجا auth_error دریافت می‌کنیم
            // می‌توانیم پیام‌های اولیه را اینجا بفرستیم
            socket.send(JSON.stringify({ type: 'get_initial_data' })); // درخواست اطلاعات اولیه
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Message from server:', message);

            switch (message.type) {
                case 'connected':
                    console.log('Server acknowledged connection. User ID:', message.payload.userId);
                    currentUserData = { id: message.payload.userId, /* ... سایر اطلاعات */ }; // ذخیره اطلاعات کاربر فعلی
                    document.getElementById('main-user-name').textContent = message.payload.username || 'کاربر'; // نمایش نام کاربر اصلی
                    // document.getElementById('main-user-avatar').src = message.payload.avatar || '/default-profile.png';
                    break;
                case 'auth_error':
                    console.error('Authentication Error:', message.message);
                    // نمایش خطا و هدایت به صفحه لاگین
                    alert('خطا در احراز هویت. لطفاً دوباره وارد شوید.');
                    localStorage.removeItem('token');
                    window.location.href = '/'; // فرض می‌کنیم صفحه لاگین login.html است
                    break;
                case 'search_results':
                    renderUserList(message.payload);
                    break;
                case 'chat_opened':
                    currentChattingWith = message.payload.id; // تنظیم کاربر فعلی
                    updateChatHeader(message.payload);
                    messageContainer.innerHTML = ''; // پاک کردن پیام‌های قبلی
                    // در اینجا باید تاریخچه چت بارگذاری شود
                    // loadChatHistory(currentChattingWith);
                    break;
                case 'chat_history': // دریافت تاریخچه پیام‌ها
                    message.payload.forEach(msg => displayMessage(msg, msg.from === currentUserData.id));
                    break;
                case 'new_message':
                    // نمایش پیام جدید دریافتی
                    const isCurrentUserMessage = message.payload.from === currentUserData.id;
                    if (isCurrentUserMessage || message.payload.to === currentUserData.id) { // اگر پیام برای ما بود
                        if (message.payload.from === currentChattingWith || isCurrentUserMessage) {
                            displayMessage(message.payload, isCurrentUserMessage);
                        } else {
                            // نمایش اعلان برای چت‌های دیگر
                            showNotification(message.payload.senderName || 'کاربر', message.payload.text);
                            // آپدیت لیست چت‌ها (اگر لازم بود)
                        }
                    }
                    break;
                case 'message_sent_ack':
                    // تایید دریافت پیام توسط سرور (مثلا نمایش تیک دوم)
                    // ما پیام را در کلاینت خودمان نمایش دادیم، این فقط برای اطمینان است
                    console.log('Message acknowledged:', message.payload);
                    // می‌توان وضعیت پیام ارسال شده را به 'sent' تغییر داد
                    break;
                case 'typing_indicator':
                    // نمایش وضعیت "در حال تایپ..."
                    if (message.payload.userId === currentChattingWith) {
                        recipientStatus.textContent = message.payload.isTyping ? 'در حال تایپ...' : 'آنلاین';
                    }
                    break;
                case 'user_profile':
                    displayUserProfileInModal(message.payload);
                    break;
                // ... case های دیگر
            }
        };

        socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event.code, event.reason);
            recipientStatus.textContent = 'قطع شد';
            // تلاش برای اتصال مجدد بعد از چند ثانیه
            setTimeout(connectWebSocket, 5000);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            recipientStatus.textContent = 'خطا';
        };
    }

    // --------- توابع مربوط به UI ---------

    // تابع جستجو با Debounce
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = searchInput.value.trim();
        if (query.length > 1) {
            debounceTimer = setTimeout(() => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: 'search_user', payload: { query } }));
                }
            }, 300);
        } else {
            renderUserList([]); // پاک کردن نتایج اگر کوئری کوتاه شد
        }
    });

    // نمایش لیست کاربران (نتایج جستجو یا لیست چت‌ها)
    function renderUserList(users) {
        chatList.innerHTML = ''; // پاک کردن لیست قبلی
        if (users.length === 0 && searchInput.value.trim().length > 1) {
            chatList.innerHTML = '<li class="no-results">کاربری یافت نشد.</li>';
            return;
        }
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.classList.add('chat-item');
            listItem.dataset.userId = user.id;
            listItem.innerHTML = `
                <img src="${user.avatar || '/default-avatar.png'}" alt="آواتار" class="avatar small-avatar">
                <div class="chat-info">
                    <h4>${user.name || user.username}</h4>
                    <p>${user.lastMessage || ''}</p> <!-- نمایش آخرین پیام اگر موجود بود -->
                </div>
                <span class="timestamp">${user.lastMessageTime || ''}</span>
            `;
            listItem.addEventListener('click', () => openChatWith(user));
            chatList.appendChild(listItem);
        });
    }

    // باز کردن چت با یک کاربر
    function openChatWith(user) {
        console.log(`Opening chat with user: ${user.id}`);
        currentChattingWith = user.id;

        // هایلایت کردن آیتم چت فعال
        document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
        const clickedItem = document.querySelector(`.chat-item[data-user-id="${user.id}"]`);
        if (clickedItem) clickedItem.classList.add('active');

        // ارسال درخواست به سرور برای باز کردن چت
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'open_chat', payload: { userId: user.id } }));
            socket.send(JSON.stringify({ type: 'get_chat_history', payload: { userId: user.id } })); // درخواست تاریخچه
        }

        // آپدیت هدر چت
        updateChatHeader(user);
        messageContainer.innerHTML = '<div class="loading-messages">در حال بارگذاری پیام‌ها...</div>'; // نمایش لودینگ
    }

    // به‌روزرسانی هدر پنجره چت
    function updateChatHeader(user) {
        recipientAvatar.src = user.avatar || '/default-avatar.png';
        recipientName.textContent = user.name || user.username;
        recipientStatus.textContent = user.status || 'در دسترس'; // وضعیت کاربر (آنلاین، آفلاین، ...)
    }

    // نمایش پیام در پنجره چت
    function displayMessage(messageData, isMyMessage) {
        const messageContainer = document.getElementById('message-container');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', isMyMessage ? 'my-message' : 'other-message');

        const senderInfo = isMyMessage ? 'me' : 'other'; // برای کلاس CSS

        const timestamp = new Date(messageData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageElement.innerHTML = `
            <p>${messageData.text}</p>
            <span class="message-time">${timestamp}</span>
            ${isMyMessage ? '<span class="message-status">✓</span>' : ''}
        `;
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight; // اسکرول به پایین
    }

    // ارسال پیام
    sendBtn.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText && currentChattingWith && socket && socket.readyState === WebSocket.OPEN) {
            const messagePayload = {
                to: currentChattingWith,
                text: messageText,
                timestamp: new Date().toISOString()
            };
            socket.send(JSON.stringify({ type: 'send_message', payload: messagePayload }));

            // نمایش پیام در کلاینت خودمان بلافاصله (با وضعیت 'sending')
            displayMessage({ ...messagePayload, status: 'sending' }, true);
            messageInput.value = ''; // پاک کردن ورودی
            clearTimeout(typingTimer); // توقف وضعیت تایپ بعد از ارسال پیام
            sendTypingIndicator(false); // اعلام عدم تایپ
        }
    });

    // مدیریت وضعیت "در حال تایپ..."
    messageInput.addEventListener('input', () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            sendTypingIndicator(true); // اعلام شروع تایپ
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                sendTypingIndicator(false); // اعلام پایان تایپ بعد از 3 ثانیه عدم فعالیت
            }, 3000);
        }
    });

    function sendTypingIndicator(isTyping) {
        if (currentChattingWith && socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'typing',
                payload: { userId: currentChattingWith, isTyping: isTyping }
            }));
        }
    }


    // نمایش Modal پروفایل
    viewProfileBtn.addEventListener('click', () => {
        if (currentChattingWith && socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'get_user_profile', payload: { userId: currentChattingWith } }));
        }
    });

    closeModalBtn.addEventListener('click', () => {
        profileModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });

    function displayUserProfileInModal(userProfile) {
        modalProfileAvatar.src = userProfile.avatar || '/default-avatar.png';
        modalProfileName.textContent = userProfile.name || userProfile.username;
        modalProfileUsername.textContent = userProfile.username;
        modalProfileStatus.textContent = userProfile.status || 'ناشناخته';
        modalProfileBio.textContent = userProfile.bio || 'بدون بیوگرافی';
        profileModal.style.display = 'block';
    }

    // تابع برای نمایش اعلان (Notification) - نیاز به اجازه مرورگر دارد
    function showNotification(title, body) {
        if (!("Notification" in window)) {
            alert("این مرورگر از اعلان‌های دسکتاپ پشتیبانی نمی‌کند.");
        } else if (Notification.permission === "granted") {
            new Notification(title, { body: body, icon: '/favicon.png' });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body: body, icon: '/favicon.png' });
                }
            });
        }
    }

    // اتصال اولیه WebSocket
    function initializeApp() {
        if (!token) {
            console.error("Authentication token not found.");
            window.location.href = '/'; // هدایت به صفحه لاگین اگر توکن نیست
            return;
        }
        connectWebSocket();
    }

    initializeApp();
});
