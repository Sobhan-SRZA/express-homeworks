const socketUrl = `http://localhost:3000/ws`;

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
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
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
                console.log('Message acknowledged:', message.payload);

                break;

            case 'typing_indicator':
                break;

            case 'user_profile':
                break;

            case 'user_status':
                const { userId, online, lastSeen } = message.payload;
                
                console.log("🚀 ~ connectWebSocket ~ message.payload:", message.payload)
                console.log("🚀 ~ connectWebSocket ~ currentChat && userId === currentChat.id:", currentChat && userId === currentChat.id)
                if (currentChat && userId === currentChat.id) {
                    currentChat.status = online ? "آنلاین" : "آفلاین";
                    currentChat.lastSeen = new Date(lastSeen);
                }

                break;
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
                <p class="chat-status${user.status === "آفلاین" ? " status-offline" : " status-online"}">${user.status || '...'}</p>
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
    }

    recipientName.innerText = user.username;
    recipientStatus.classList.add(user.status === "آفلاین" ? "status-offline" : "status-online");
    recipientStatus.innerText = user.status;

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
            ${isMyMessage ? '<span class="message-status">✓</span>' : ''}
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

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (!messageText || !currentChat) {
        return;
    }

    const messagePayload = {
        to: currentChat.id,
        text: messageText,
        timestamp: new Date().toISOString()
    };

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'sent');
    const timestamp = new Date(messagePayload.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageElement.innerHTML = `
        <div class="message-content">${messagePayload.text}</div>
        <div class="message-timestamp">${timestamp}</div>
    `;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    if (socket) {
        socket.send(JSON.stringify({ type: 'send_message', payload: messagePayload }));

        console.log("Message sent:", messagePayload);
    }

    else {
        console.error("WebSocket is not connected.");
    }

    messageInput.value = '';

    return;
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
