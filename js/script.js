// 应用状态管理
const appState = {
    currentUser: null,
    currentUserId: null,
    contacts: [
        { id: 1, name: '张三', avatar: '👨', lastMessage: '你好！', time: '10:30', wechatId: 'zhangsan123', region: '北京', signature: '热爱生活，热爱编程' },
        { id: 2, name: '李四', avatar: '👩', lastMessage: '在吗？', time: '09:15', wechatId: 'lisi456', region: '上海', signature: '简单快乐每一天' },
        { id: 3, name: '王五', avatar: '👨', lastMessage: '晚上一起吃饭？', time: '昨天', wechatId: 'wangwu789', region: '广州', signature: '美食爱好者' },
        { id: 4, name: '赵六', avatar: '👩', lastMessage: '文件已发送', time: '昨天', wechatId: 'zhaoliu012', region: '深圳', signature: '努力工作，享受生活' },
        { id: 5, name: '钱七', avatar: '👨', lastMessage: '好的，收到', time: '周三', wechatId: 'qianqi345', region: '杭州', signature: '旅行达人' }
    ],
    currentChat: null,
    messages: {
        1: [
            { type: 'received', content: '你好！', time: '10:25' },
            { type: 'sent', content: '你好，最近怎么样？', time: '10:26' },
            { type: 'received', content: '还不错，你呢？', time: '10:27' }
        ],
        2: [
            { type: 'received', content: '在吗？', time: '09:10' },
            { type: 'sent', content: '在的，有什么事吗？', time: '09:12' }
        ],
        3: [
            { type: 'received', content: '晚上一起吃饭？', time: '昨天 18:30' },
            { type: 'sent', content: '好啊，几点？', time: '昨天 18:31' }
        ]
    },
    // 好友申请系统
    friendRequests: [
        { id: 6, name: '孙八', avatar: '👨', wechatId: 'sunba678', region: '成都', signature: '篮球爱好者', status: 'pending', time: '2小时前' },
        { id: 7, name: '周九', avatar: '👩', wechatId: 'zhoujiu901', region: '武汉', signature: '音乐发烧友', status: 'pending', time: '1天前' }
    ],
    // 可搜索的用户（非好友）
    searchableUsers: [
        { id: 8, name: '吴十', avatar: '👨', wechatId: 'wushi234', region: '南京', signature: '摄影爱好者' },
        { id: 9, name: '郑十一', avatar: '👩', wechatId: 'zhengshiyi567', region: '西安', signature: '读书爱好者' },
        { id: 10, name: '王十二', avatar: '👨', wechatId: 'wangshier890', region: '重庆', signature: '美食博主' }
    ],
    // 朋友圈系统
    moments: [
        {
            id: 1,
            userId: 1,
            userName: '张三',
            userAvatar: '👨',
            content: '今天天气真好，适合出去走走！',
            time: '2小时前',
            likes: ['李四', '王五'],
            comments: [
                { user: '李四', content: '是啊，我也准备出去' },
                { user: '王五', content: '约起来！' }
            ]
        },
        {
            id: 2,
            userId: 2,
            userName: '李四',
            userAvatar: '👩',
            content: '分享一首好听的歌给大家～',
            time: '5小时前',
            likes: ['张三', '赵六'],
            comments: [
                { user: '张三', content: '好听！' }
            ]
        },
        {
            id: 3,
            userId: 3,
            userName: '王五',
            userAvatar: '👨',
            content: '新学的菜谱，味道不错！',
            time: '昨天',
            likes: ['李四'],
            comments: []
        }
    ]
};

// 页面切换函数
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// 标签切换函数
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// 渲染聊天列表
function renderChatList() {
    const chatList = document.querySelector('.chat-list');
    chatList.innerHTML = appState.contacts.map(contact => `
        <div class="chat-item" data-contact-id="${contact.id}">
            <div class="chat-avatar">${contact.avatar}</div>
            <div class="chat-info">
                <div class="chat-name">${contact.name}</div>
                <div class="chat-preview">${contact.lastMessage}</div>
            </div>
            <div class="chat-time">${contact.time}</div>
        </div>
    `).join('');
    
    // 添加点击事件
    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-contact-id'));
            openChat(contactId);
        });
    });
}

// 渲染联系人列表
function renderContactsList() {
    const contactsSection = document.querySelector('.contact-section:last-child');
    contactsSection.innerHTML = appState.contacts.map(contact => `
        <div class="contact-item" data-contact-id="${contact.id}">
            <div class="contact-avatar">${contact.avatar}</div>
            <div class="contact-info">
                <span class="contact-name">${contact.name}</span>
            </div>
        </div>
    `).join('');
    
    // 添加点击事件
    document.querySelectorAll('.contact-item[data-contact-id]').forEach(item => {
        item.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-contact-id'));
            openChat(contactId);
        });
    });
}

// 打开聊天窗口
function openChat(contactId) {
    const contact = appState.contacts.find(c => c.id === contactId);
    if (!contact) return;
    
    appState.currentChat = contactId;
    document.getElementById('chat-contact-name').textContent = contact.name;
    renderMessages();
    showPage('chat-window');
}

// 渲染消息
function renderMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    const messages = appState.messages[appState.currentChat] || [];
    
    messagesContainer.innerHTML = messages.map(msg => `
        <div class="message ${msg.type}">
            <div class="message-bubble">
                ${msg.content}
                <div class="message-time">${msg.time}</div>
            </div>
        </div>
    `).join('');
    
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 发送消息
function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    
    if (!content || !appState.currentChat) return;
    
    const newMessage = {
        type: 'sent',
        content: content,
        time: new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    };
    
    if (!appState.messages[appState.currentChat]) {
        appState.messages[appState.currentChat] = [];
    }
    
    appState.messages[appState.currentChat].push(newMessage);
    
    // 更新联系人最后消息
    const contact = appState.contacts.find(c => c.id === appState.currentChat);
    if (contact) {
        contact.lastMessage = content;
        contact.time = '刚刚';
    }
    
    input.value = '';
    renderMessages();
    
    // 模拟对方回复
    setTimeout(() => {
        const replyMessage = {
            type: 'received',
            content: getRandomReply(),
            time: new Date().toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };
        
        appState.messages[appState.currentChat].push(replyMessage);
        
        if (contact) {
            contact.lastMessage = replyMessage.content;
            contact.time = '刚刚';
        }
        
        renderMessages();
        renderChatList();
    }, 1000 + Math.random() * 2000);
}

// 随机回复消息
function getRandomReply() {
    const replies = [
        '好的',
        '收到',
        '明白了',
        '谢谢',
        '没问题',
        '稍等',
        '一会聊',
        'OK',
        '知道了',
        '好的，谢谢'
    ];
    return replies[Math.floor(Math.random() * replies.length)];
}

// 登录功能
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }
    
    // 模拟登录成功
    appState.currentUser = username;
    document.getElementById('current-user').textContent = username;
    document.getElementById('profile-name').textContent = username;
    
    showPage('main-page');
    renderChatList();
    renderContactsList();
}

// 注册功能
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    if (!username || !email || !password || !confirmPassword) {
        alert('请填写所有字段');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致');
        return;
    }
    
    if (password.length < 6) {
        alert('密码长度至少6位');
        return;
    }
    
    // 模拟注册成功
    alert('注册成功！请登录');
    showPage('login-page');
    
    // 清空表单
    document.getElementById('register-form').reset();
}

// 初始化事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 登录表单
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // 注册表单
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // 注册链接
    document.getElementById('register-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('register-page');
    });
    
    // 返回登录
    document.getElementById('back-to-login').addEventListener('click', function() {
        showPage('login-page');
    });
    
    // 底部标签切换
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // 返回主界面
    document.getElementById('back-to-main').addEventListener('click', function() {
        showPage('main-page');
        renderChatList();
    });
    
    // 发送消息
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    
    // 回车发送消息
    document.getElementById('message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 模拟一些初始数据
    renderChatList();
    renderContactsList();
    
    // 添加一些示例联系人到通讯录
    const additionalContacts = [
        { id: 6, name: '孙八', avatar: '👨', lastMessage: '周末有空吗？', time: '周一' },
        { id: 7, name: '周九', avatar: '👩', lastMessage: '会议改期了', time: '上周' },
        { id: 8, name: '吴十', avatar: '👨', lastMessage: '文件已收到', time: '上周' }
    ];
    
    appState.contacts.push(...additionalContacts);
    
    // 初始化消息数据
    appState.messages[6] = [
        { type: 'received', content: '周末有空吗？', time: '周一 14:20' }
    ];
    appState.messages[7] = [
        { type: 'received', content: '会议改期了', time: '上周五 09:30' }
    ];
    appState.messages[8] = [
        { type: 'received', content: '文件已收到', time: '上周三 16:45' }
    ];
});

// 添加一些工具函数
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
        return '昨天';
    } else if (days < 7) {
        return `${days}天前`;
    } else {
        return date.toLocaleDateString('zh-CN');
    }
}

// 搜索功能（简化版）
function searchContacts(query) {
    return appState.contacts.filter(contact => 
        contact.name.toLowerCase().includes(query.toLowerCase())
    );
}

// 添加新联系人
function addContact(name, avatar = '👤') {
    const newContact = {
        id: Math.max(...appState.contacts.map(c => c.id)) + 1,
        name: name,
        avatar: avatar,
        lastMessage: '开始聊天',
        time: '刚刚'
    };
    
    appState.contacts.push(newContact);
    appState.messages[newContact.id] = [];
    
    renderChatList();
    renderContactsList();
    
    return newContact;
}

// 朋友圈功能
function renderMoments() {
    const momentsList = document.getElementById('moments-list');
    momentsList.innerHTML = appState.moments.map(moment => `
        <div class="moment-item">
            <div class="moment-header">
                <div class="moment-avatar">${moment.userAvatar}</div>
                <div class="moment-user-info">
                    <div class="moment-username">${moment.userName}</div>
                    <div class="moment-time">${moment.time}</div>
                </div>
            </div>
            <div class="moment-content">${moment.content}</div>
            <div class="moment-actions">
                <span>${moment.likes.length} 赞</span>
                <span>${moment.comments.length} 评论</span>
            </div>
        </div>
    `).join('');
}

function postMoment() {
    const content = document.getElementById('moment-content').value.trim();
    if (!content) {
        alert('请输入朋友圈内容');
        return;
    }
    
    const newMoment = {
        id: Math.max(...appState.moments.map(m => m.id)) + 1,
        userId: appState.currentUserId || 0,
        userName: appState.currentUser || '用户',
        userAvatar: '👤',
        content: content,
        time: '刚刚',
        likes: [],
        comments: []
    };
    
    appState.moments.unshift(newMoment);
    showPage('moments-page');
    renderMoments();
    
    // 清空输入框
    document.getElementById('moment-content').value = '';
}

// 好友申请功能
function renderFriendRequests() {
    const requestsList = document.getElementById('requests-list');
    requestsList.innerHTML = appState.friendRequests.map(request => `
        <div class="request-item">
            <div class="request-user-info">
                <div class="request-avatar">${request.avatar}</div>
                <div>
                    <div class="request-name">${request.name}</div>
                    <div class="request-status">${request.time}</div>
                </div>
            </div>
            <div class="request-actions">
                <button class="accept-btn" onclick="acceptFriendRequest(${request.id})">接受</button>
                <button class="reject-btn" onclick="rejectFriendRequest(${request.id})">拒绝</button>
            </div>
        </div>
    `).join('');
}

function acceptFriendRequest(requestId) {
    const request = appState.friendRequests.find(r => r.id === requestId);
    if (request) {
        // 添加到联系人
        const newContact = {
            id: request.id,
            name: request.name,
            avatar: request.avatar,
            lastMessage: '开始聊天',
            time: '刚刚',
            wechatId: request.wechatId,
            region: request.region,
            signature: request.signature
        };
        
        appState.contacts.push(newContact);
        appState.messages[request.id] = [];
        
        // 从申请列表中移除
        appState.friendRequests = appState.friendRequests.filter(r => r.id !== requestId);
        
        renderFriendRequests();
        renderChatList();
        renderContactsList();
        
        alert(`已添加 ${request.name} 为好友`);
    }
}

function rejectFriendRequest(requestId) {
    appState.friendRequests = appState.friendRequests.filter(r => r.id !== requestId);
    renderFriendRequests();
}

function searchFriend() {
    const friendId = document.getElementById('friend-id-input').value.trim();
    if (!friendId) {
        alert('请输入微信号或手机号');
        return;
    }
    
    // 模拟搜索用户
    const foundUser = appState.searchableUsers.find(user => 
        user.wechatId.includes(friendId) || user.name.includes(friendId)
    );
    
    if (foundUser) {
        showUserProfile(foundUser);
    } else {
        alert('未找到该用户');
    }
}

// 搜索用户功能
function renderSearchResults(query = '') {
    const resultsContainer = document.getElementById('search-results');
    
    let results = appState.searchableUsers;
    if (query) {
        results = appState.searchableUsers.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.wechatId.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    resultsContainer.innerHTML = results.map(user => `
        <div class="search-result-item" onclick="showUserProfile(${user.id})">
            <div class="result-avatar">${user.avatar}</div>
            <div class="result-info">
                <div class="result-name">${user.name}</div>
                <div class="result-id">微信号: ${user.wechatId}</div>
            </div>
        </div>
    `).join('');
}

function showUserProfile(user) {
    if (typeof user === 'number') {
        user = appState.searchableUsers.find(u => u.id === user);
    }
    
    if (!user) return;
    
    document.getElementById('profile-user-name').textContent = user.name;
    document.getElementById('profile-user-id').textContent = `微信号: ${user.wechatId}`;
    document.getElementById('profile-region').textContent = user.region;
    document.getElementById('profile-signature').textContent = user.signature;
    
    showPage('user-profile-page');
}

function addFriend() {
    const userName = document.getElementById('profile-user-name').textContent;
    
    // 检查是否已经是好友
    const isAlreadyFriend = appState.contacts.some(contact => contact.name === userName);
    if (isAlreadyFriend) {
        alert('该用户已经是您的好友');
        return;
    }
    
    // 检查是否已经发送过申请
    const hasPendingRequest = appState.friendRequests.some(request => request.name === userName);
    if (hasPendingRequest) {
        alert('已向该用户发送过好友申请');
        return;
    }
    
    // 发送好友申请
    const user = appState.searchableUsers.find(u => u.name === userName);
    if (user) {
        const newRequest = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            wechatId: user.wechatId,
            region: user.region,
            signature: user.signature,
            status: 'pending',
            time: '刚刚'
        };
        
        appState.friendRequests.push(newRequest);
        alert('好友申请已发送');
        showPage('friend-requests-page');
        renderFriendRequests();
    }
}

// 实时搜索功能
function setupSearch() {
    const searchInput = document.getElementById('user-search-input');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            renderSearchResults(this.value);
        }, 300);
    });
}

// 更新初始化事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 原有的监听器...
    
    // 朋友圈功能
    document.getElementById('open-moments').addEventListener('click', function() {
        document.getElementById('moments-username').textContent = appState.currentUser || '用户';
        showPage('moments-page');
        renderMoments();
    });
    
    document.getElementById('post-moment-btn').addEventListener('click', function() {
        showPage('post-moment-page');
    });
    
    document.getElementById('publish-btn').addEventListener('click', function() {
        postMoment();
    });
    
    // 搜索用户功能
    document.getElementById('search-users').addEventListener('click', function() {
        showPage('search-users-page');
        renderSearchResults();
        setupSearch();
    });
    
    // 好友申请功能
    document.querySelector('.contact-item:first-child').addEventListener('click', function() {
        showPage('friend-requests-page');
        renderFriendRequests();
    });
    
    document.getElementById('search-friend-btn').addEventListener('click', searchFriend);
    
    // 添加好友功能
    document.getElementById('add-friend-btn').addEventListener('click', addFriend);
    
    // 返回按钮功能
    document.getElementById('back-to-discover').addEventListener('click', function() {
        showPage('main-page');
        switchTab('discover');
    });
    
    document.getElementById('back-to-moments').addEventListener('click', function() {
        showPage('moments-page');
    });
    
    document.getElementById('back-to-discover-search').addEventListener('click', function() {
        showPage('main-page');
        switchTab('discover');
    });
    
    document.getElementById('back-to-contacts').addEventListener('click', function() {
        showPage('main-page');
        switchTab('contacts');
    });
    
    document.getElementById('back-to-search').addEventListener('click', function() {
        showPage('search-users-page');
    });
    
    // 模拟一些初始数据
    renderChatList();
    renderContactsList();
    
    // 添加一些示例联系人到通讯录
    const additionalContacts = [
        { id: 6, name: '孙八', avatar: '👨', lastMessage: '周末有空吗？', time: '周一', wechatId: 'sunba678', region: '成都', signature: '篮球爱好者' },
        { id: 7, name: '周九', avatar: '👩', lastMessage: '会议改期了', time: '上周', wechatId: 'zhoujiu901', region: '武汉', signature: '音乐发烧友' },
        { id: 8, name: '吴十', avatar: '👨', lastMessage: '文件已收到', time: '上周', wechatId: 'wushi234', region: '南京', signature: '摄影爱好者' }
    ];
    
    appState.contacts.push(...additionalContacts);
    
    // 初始化消息数据
    appState.messages[6] = [
        { type: 'received', content: '周末有空吗？', time: '周一 14:20' }
    ];
    appState.messages[7] = [
        { type: 'received', content: '会议改期了', time: '上周五 09:30' }
    ];
    appState.messages[8] = [
        { type: 'received', content: '文件已收到', time: '上周三 16:45' }
    ];
});