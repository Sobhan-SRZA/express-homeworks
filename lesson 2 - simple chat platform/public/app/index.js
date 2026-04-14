let currentUser = { id: 'user123', name: 'سبحان' };
let currentChat = null;
let socket = null;

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
const modalProfileStatus = document.getElementById('modal-profile-status');
const chatWindowContent = document.getElementById('chat-window-content');
const noChatSelectedMessage = document.getElementById('no-chat-selected-message');


/**
 * 
 * @param {boolean} showChat 
 */
function toggleChatWindow(showChat) {
    if (showChat) {
        chatWindowContent.style.display = 'block';
        noChatSelectedMessage.style.display = 'none';
    }

    else {
        chatWindowContent.style.display = 'none';
        noChatSelectedMessage.style.display = 'block';
    }
}

/**
 * 
 * @param {Array<Object>} messages 
 */
function displayMessages(messages) {
    messageContainer.innerHTML = '';
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        if (msg.senderId === currentUser.id) {
            messageElement.classList.add('sent');
        }

        else {
            messageElement.classList.add('received');
        }

        const timestamp = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageElement.innerHTML = `
            <div class="message-content">${msg.text}</div>
            <div class="message-timestamp">${timestamp}</div>
        `;
        messageContainer.appendChild(messageElement);
    });

    messageContainer.scrollTop = messageContainer.scrollHeight;
}

/**
 * 
 * @param {Object} user 
 */
function updateChatHeader(user) {
    recipientName.innerText = user.name;
    recipientStatus.innerText = user.status || 'در حال تایپ...';
}

/**
 * 
 * @param {Object} user
 */
async function openChat(user) {
    console.log("Opening chat with user:", user);
    currentChat = user;
    updateChatHeader(user);
    toggleChatWindow(true);

    const chatUrl = `/chat/${user.username}`;
    if (window.location.pathname !== chatUrl) {
        window.history.pushState({ userId: user.id, username: user.username }, '', chatUrl);
    }

    try {
        const messages = await fetchMessages(currentUser.id, user.id);
        displayMessages(messages);
    }

    catch (error) {
        console.error("Error fetching messages:", error);
    }

    if (!socket) {
        connectWebSocket();
    }

    socket.emit('update_message_status', { fromUserId: user.id, toUserId: currentUser.id });
}

/**
 * 
 */
async function searchUsers() {
    const query = searchInput.value.trim();
    if (!query) {
        await fetchAndDisplayChatList();

        return;
    }

    console.log("Searching for users:", query);

    try {
        const users = await searchApi(query);
        displaySearchResults(users);
    }

    catch (error) {
        console.error("Error searching users:", error);
    }
}

/**
 * 
 * @param {Array<Object>} users 
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
                <h4 class="chat-name">${user.name}</h4>
                <p class="chat-status">${user.status || '...'}</p>
            </div>
        `;

        listItem.addEventListener('click', () => openChat(user));
        chatList.appendChild(listItem);
    });
}

/**
 * 
 */
async function fetchAndDisplayChatList() {
    chatList.innerHTML = '';
    console.log("Fetching chat list for user:", currentUser.id);

    try {
        const chats = await fetchChatsApi(currentUser.id);
        chats.forEach(chat => {
            const listItem = document.createElement('li');
            listItem.classList.add('chat-item');

            const otherUser = chat.participants.find(p => p.id !== currentUser.id);
            listItem.dataset.userId = otherUser.id;
            listItem.dataset.username = otherUser.username;
            listItem.innerHTML = `
                <div class="chat-avatar"></div>
                <div class="chat-info">
                    <h4 class="chat-name">${otherUser.name}</h4>
                    <p class="chat-last-message">${chat.lastMessage || ''}</p>
                </div>
                ${chat.unreadCount > 0 ? `<span class="unread-count">${chat.unreadCount}</span>` : ''}
            `;
            listItem.addEventListener('click', () => openChat(otherUser));
            chatList.appendChild(listItem);
        });
    }

    catch (error) {
        console.error("Error fetching chat list:", error);
    }
}

/**
 * 
 */
function sendMessage() {
    const messageText = messageInput.value.trim();
    if (!messageText || !currentChat) {
        return;
    }

    const messageData = {
        senderId: currentUser.id,
        recipientId: currentChat.id,
        text: messageText,
        timestamp: new Date().toISOString()
    };

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'sent');
    const timestamp = new Date(messageData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageElement.innerHTML = `
        <div class="message-content">${messageData.text}</div>
        <div class="message-timestamp">${timestamp}</div>
    `;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;


    if (socket) {
        socket.emit('sendMessage', messageData);
        console.log("Message sent:", messageData);
    }

    else {
        console.error("WebSocket is not connected.");
    }

    messageInput.value = '';
}

/**
 * 
 */
function connectWebSocket() {
    const token = localStorage.getItem("token");

    const socketUrl = `http://localhost:3000/ws?token=${token}`;
    socket = new WebSocket(socketUrl);

    console.log("Simulating WebSocket connection...");

    socket.onmessage((message) => {
        console.log('Connected to WebSocket server');

        socket.emit('identify', { userId: currentUser.id, username: currentUser.name });

        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/chat/')) {
            const username = currentPath.split('/')[2];
            socket.emit('open_chat', { targetUser: username });
        }
    });

    socket.on('newMessage', (message) => {
        console.log('New message received:', message);
        handleNewMessage(message);
    });

    socket.on('userStatusUpdate', (data) => {
        console.log('User status update:', data);
        handleUserStatusUpdate(data);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        socket = null;
    });
}

/**
 * 
 * @param {Object} message
 */
function handleNewMessage(message) {
    if (currentChat && message.senderId === currentChat.id) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'received');
        const timestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageElement.innerHTML = `
            <div class="message-content">${message.text}</div>
            <div class="message-timestamp">${timestamp}</div>
        `;
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;

        showNotification(currentChat.name, message.text);

    }

    else if (message.senderId !== currentUser.id) {
        showNotification(
            (currentChat && message.senderId === currentChat.id) ? currentChat.name : `کاربر ${message.senderId.substring(0, 4)}`,
            message.text
        );

        const chatItem = chatList.querySelector(`[data-user-id="${message.senderId}"]`);
        if (chatItem) {
            let unreadCount = parseInt(chatItem.querySelector('.unread-count')?.innerText || '0', 10);
            unreadCount++;
            chatItem.querySelector('.unread-count').innerText = unreadCount;
            chatItem.querySelector('.unread-count').style.display = 'block';
        }
    }

    socket.emit('update_message_status', { fromUserId: message.senderId, toUserId: currentUser.id });
}

/**
 * 
 * @param {Object} data 
 */
function handleUserStatusUpdate(data) {
    const user = data;

    if (currentChat && currentChat.id === user.userId) {
        recipientStatus.innerText = user.status;
    }

    const chatItem = chatList.querySelector(`[data-user-id="${user.userId}"]`);
    if (chatItem) {
        const statusElement = chatItem.querySelector('.chat-status');
        if (statusElement) {
            statusElement.innerText = user.status;
        }
    }
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
    modalProfileName.innerText = user.name;
    modalProfileUsername.innerText = user.username;
    modalProfileStatus.innerText = user.status || 'وضعیت نامشخص';
    profileModal.style.display = "block";
}


sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

viewProfileBtn.addEventListener('click', () => {
    if (currentChat) {
        displayUserProfileModal(currentChat);
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


let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchUsers, 300);
});


mainUserName.innerText = currentUser.name;

fetchAndDisplayChatList();

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
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/chat/')) {
        const username = currentPath.split('/')[2];
        console.log("URL contains chat for:", username);

        findUserByUsername(username)
            .then(user => {
                if (user) {
                    openChat(user);
                }

                else {
                    toggleChatWindow(false);
                }
            });

        const testUser = { id: 'user_from_url', username: username, name: username, status: '...' };
        openChat(testUser);

    }

    else {
        toggleChatWindow(false);
    }

    connectWebSocket();
});

async function fetchMessages(currentUserId, otherUserId) {
    console.log(`Simulating fetchMessages between ${currentUserId} and ${otherUserId}`);
    return await fetch(`/api/chats/${currentUserId}/${otherUserId}/messages`).then(res => res.json());
}

async function fetchChatsApi(userId) {
    console.log(`Simulating fetchChatsApi for ${userId}`);
    return await fetch(`${userId}`).then(res => res.json());
}

async function searchApi(query) {
    console.log(`Simulating searchApi for query: ${query}`);

    socket.emit('search_results', { query })

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "search_user") {
            const parsedMessage = JSON.parse(message);

            const { foundUsers } = parsedMessage.payload;

            console.log("🚀 ~ searchApi ~ foundUsers:", foundUsers)
            return foundUsers;
        }
    };

    return await fetch(`/api/users/search?q=${query}`).then(res => res.json());
}

async function findUserByUsername(username) {
    console.log(`Simulating findUserByUsername: ${username}`);
    return await fetch(`/api/users/username/${username}`).then(res => res.json());
}

document.addEventListener('click', () => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
});
