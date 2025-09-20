// إعدادات Google OAuth 2.0 - يتم تحميلها من ملف config.js أو متغيرات البيئة
// في حالة عدم توفر الملف، استخدم القيم الافتراضية
let GOOGLE_CONFIG = {
    web: {
        client_id: "YOUR_GOOGLE_CLIENT_ID_HERE",
        project_id: "YOUR_GOOGLE_PROJECT_ID_HERE",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_secret: "YOUR_GOOGLE_CLIENT_SECRET_HERE",
        redirect_uris: [
            "http://localhost:8000/oauth2callback.html",
            "https://your-domain.vercel.app/oauth2callback.html"
        ],
        javascript_origins: [
            "http://localhost:8000",
            "https://your-domain.vercel.app"
        ]
    }
};

// محاولة تحميل الإعدادات من ملف config.js أو متغيرات البيئة
try {
    if (typeof window !== 'undefined' && window.GOOGLE_CONFIG) {
        GOOGLE_CONFIG = window.GOOGLE_CONFIG;
        console.log('تم تحميل إعدادات Google OAuth 2.0 بنجاح:', GOOGLE_CONFIG);
    } else {
        console.warn('لم يتم العثور على window.GOOGLE_CONFIG');
        
        // محاولة استخدام متغيرات البيئة في Vercel
        if (typeof process !== 'undefined' && process.env) {
            GOOGLE_CONFIG.web.client_id = process.env.GOOGLE_CLIENT_ID || GOOGLE_CONFIG.web.client_id;
            GOOGLE_CONFIG.web.client_secret = process.env.GOOGLE_CLIENT_SECRET || GOOGLE_CONFIG.web.client_secret;
            GOOGLE_CONFIG.web.project_id = process.env.GOOGLE_PROJECT_ID || GOOGLE_CONFIG.web.project_id;
        }
    }
} catch (error) {
    console.warn('لم يتم العثور على ملف config.js، سيتم استخدام القيم الافتراضية');
}

// متغيرات عامة
let currentUser = null;
let geminiWindow = null;
let messageQueue = [];
let isProcessing = false;

// عناصر DOM
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const geminiCanvas = document.getElementById('gemini-canvas');
const googleLoginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const settingsBtn = document.getElementById('settings-btn');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const loginStatus = document.getElementById('login-status');
const closeCanvasBtn = document.getElementById('close-canvas-btn');
const geminiIframe = document.getElementById('gemini-iframe');

// عناصر الاقتراحات
const suggestionBtns = document.querySelectorAll('.suggestion-btn');

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// تهيئة التطبيق
function initializeApp() {
    console.log('تهيئة التطبيق...');
    console.log('GOOGLE_CONFIG:', GOOGLE_CONFIG);
    
    // إخفاء شاشة المحادثة في البداية
    chatScreen.classList.add('hidden');
    geminiCanvas.classList.add('hidden');
    
    // التحقق من وجود رمز OAuth في localStorage
    const oauthCode = localStorage.getItem('oauth_code');
    if (oauthCode) {
        console.log('تم العثور على رمز OAuth، جاري معالجة تسجيل الدخول...');
        handleOAuthCode(oauthCode);
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    console.log('إعداد مستمعي الأحداث...');
    console.log('googleLoginBtn:', googleLoginBtn);
    
    // تسجيل الدخول
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
        console.log('تم إضافة مستمع الأحداث لزر تسجيل الدخول');
    } else {
        console.error('لم يتم العثور على زر تسجيل الدخول');
    }
    
    // تسجيل الخروج
    logoutBtn.addEventListener('click', handleLogout);
    
    // الإعدادات
    settingsBtn.addEventListener('click', handleSettings);
    
    // إرسال الرسالة
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // إغلاق نافذة Gemini
    closeCanvasBtn.addEventListener('click', closeGeminiCanvas);
    
    // تغيير حجم textarea تلقائياً
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    // الاقتراحات
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const suggestion = this.textContent;
            messageInput.value = suggestion;
            messageInput.focus();
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
        });
    });
    
    // تأثيرات بصرية إضافية
    setupVisualEffects();
}

// التحقق من حالة المصادقة
function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showChatScreen();
        } catch (error) {
            console.error('خطأ في تحليل بيانات المستخدم:', error);
            localStorage.removeItem('currentUser');
        }
    }
}

// معالجة تسجيل الدخول عبر Google OAuth 2.0
function handleGoogleLogin() {
    console.log('تم الضغط على زر تسجيل الدخول');
    console.log('Google OAuth 2.0 config:', GOOGLE_CONFIG);
    
    try {
        // إنشاء URL لطلب التفويض من Google OAuth 2.0
        const authUrl = createAuthUrl();
        console.log('إعادة التوجيه إلى:', authUrl);
        
        // إعادة التوجيه إلى Google OAuth 2.0
        window.location.href = authUrl;
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        showLoginStatus('خطأ في تسجيل الدخول عبر Google', 'error');
    }
}

// إنشاء URL لطلب التفويض من Google OAuth 2.0
function createAuthUrl() {
    const params = new URLSearchParams({
        client_id: GOOGLE_CONFIG.web.client_id,
        redirect_uri: getRedirectUri(),
        response_type: 'code',
        scope: 'openid profile email',
        access_type: 'offline',
        include_granted_scopes: 'true',
        state: generateState(),
        prompt: 'consent'
    });
    
    return `${GOOGLE_CONFIG.web.auth_uri}?${params.toString()}`;
}

// الحصول على redirect_uri المناسب
function getRedirectUri() {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocalhost 
        ? 'http://localhost:8000/oauth2callback.html'
        : 'https://5555-gq7r.vercel.app/oauth2callback.html';
}

// إنشاء state عشوائي للحماية من CSRF
function generateState() {
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    return state;
}

// معالجة رمز OAuth المستلم
function handleOAuthCode(code) {
    console.log('معالجة رمز OAuth:', code);
    
    // محاكاة بيانات المستخدم (في التطبيق الحقيقي، ستحتاج لاستبدال رمز التفويض برمز الوصول)
    const mockUser = {
        name: 'مستخدم Google',
        email: 'user@example.com',
        picture: 'https://via.placeholder.com/150/4285f4/ffffff?text=G',
        sub: 'google_user_' + Math.random().toString(36).substring(7)
    };
    
    // حفظ بيانات المستخدم
    currentUser = mockUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // إزالة رمز OAuth من localStorage
    localStorage.removeItem('oauth_code');
    localStorage.removeItem('oauth_state');
    
    // إظهار شاشة المحادثة
    showChatScreen();
    
    console.log('تم تسجيل الدخول بنجاح:', currentUser);
}


// معالجة استجابة المصادقة
function handleCredentialResponse(response) {
    try {
        // فك تشفير JWT token
        const payload = parseJwt(response.credential);
        
        currentUser = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            credential: response.credential
        };
        
        // حفظ بيانات المستخدم
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showLoginStatus('تم تسجيل الدخول بنجاح!', 'success');
        
        setTimeout(() => {
            showChatScreen();
        }, 1000);
        
    } catch (error) {
        console.error('خطأ في معالجة المصادقة:', error);
        showLoginStatus('خطأ في تسجيل الدخول', 'error');
    }
}

// فك تشفير JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
}


// معالجة الإعدادات
function handleSettings() {
    // يمكن إضافة نافذة إعدادات هنا
    showLoginStatus('قريباً: نافذة الإعدادات', 'success');
}

// معالجة تسجيل الخروج
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    if (typeof google !== 'undefined') {
        google.accounts.id.disableAutoSelect();
    }
    
    showLoginScreen();
    clearChat();
}

// إظهار شاشة تسجيل الدخول
function showLoginScreen() {
    loginScreen.classList.remove('hidden');
    chatScreen.classList.add('hidden');
    geminiCanvas.classList.add('hidden');
}

// إظهار شاشة المحادثة
function showChatScreen() {
    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    geminiCanvas.classList.add('hidden');
    
    if (currentUser) {
        updateUserInfo();
    }
}

// تحديث معلومات المستخدم
function updateUserInfo() {
    if (currentUser) {
        userAvatar.src = currentUser.picture;
        userName.textContent = currentUser.name;
        userEmail.textContent = currentUser.email;
    }
}

// إظهار حالة تسجيل الدخول
function showLoginStatus(message, type) {
    loginStatus.textContent = message;
    loginStatus.className = `login-status ${type}`;
    
    setTimeout(() => {
        loginStatus.textContent = '';
        loginStatus.className = 'login-status';
    }, 3000);
}

// إرسال رسالة
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isProcessing) return;
    
    // إضافة رسالة المستخدم
    addMessage(message, 'user');
    
    // مسح حقل الإدخال
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // إظهار مؤشر الكتابة
    showTypingIndicator();
    
    // معالجة الرسالة
    processMessage(message);
}

// إضافة رسالة إلى المحادثة
function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message fade-in`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    if (sender === 'user') {
        avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
    } else {
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<p>${content}</p>`;
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// إظهار مؤشر الكتابة
function showTypingIndicator() {
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// إخفاء مؤشر الكتابة
function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// معالجة الرسالة
async function processMessage(message) {
    isProcessing = true;
    sendBtn.disabled = true;
    
    try {
        // محاولة الاتصال بـ Gemini Canvas
        await connectToGeminiCanvas();
        
        // إرسال الرسالة إلى Gemini
        await sendToGemini(message);
        
        // محاكاة استجابة من الذكاء الاصطناعي
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateAIResponse(message);
            addMessage(response, 'ai');
            isProcessing = false;
            sendBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('خطأ في معالجة الرسالة:', error);
        hideTypingIndicator();
        addMessage('عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى.', 'ai');
        isProcessing = false;
        sendBtn.disabled = false;
    }
}

// الاتصال بـ Gemini Canvas
async function connectToGeminiCanvas() {
    return new Promise((resolve, reject) => {
        try {
            // فتح نافذة Gemini Canvas
            geminiCanvas.classList.remove('hidden');
            
            // انتظار تحميل الإطار
            geminiIframe.onload = () => {
                resolve();
            };
            
            geminiIframe.onerror = () => {
                reject(new Error('فشل في تحميل Gemini Canvas'));
            };
            
            // إعادة تحميل الإطار للتأكد من الاتصال
            geminiIframe.src = geminiIframe.src;
            
        } catch (error) {
            reject(error);
        }
    });
}

// إرسال رسالة إلى Gemini
async function sendToGemini(message) {
    try {
        // محاولة التفاعل مع إطار Gemini
        const iframe = geminiIframe;
        if (iframe && iframe.contentWindow) {
            // إرسال رسالة إلى الإطار
            iframe.contentWindow.postMessage({
                type: 'SEND_MESSAGE',
                message: message,
                user: currentUser
            }, 'https://gemini.google.com');
        }
    } catch (error) {
        console.log('لا يمكن إرسال الرسالة مباشرة إلى Gemini Canvas');
    }
}

// توليد استجابة ذكية
function generateAIResponse(userMessage) {
    const responses = {
        greeting: [
            'مرحباً بك! أنا سعيد لرؤيتك هنا. كيف يمكنني مساعدتك اليوم؟',
            'أهلاً وسهلاً! أنا Gemini AI، مساعدك الذكي. ما الذي تود التحدث عنه؟',
            'مرحباً! أنا هنا لمساعدتك في أي شيء تحتاجه. ما رأيك أن نبدأ؟'
        ],
        thanks: [
            'العفو! أنا سعيد لأنني استطعت مساعدتك. هل هناك أي شيء آخر يمكنني فعله لك؟',
            'لا شكر على واجب! أنا هنا دائماً لمساعدتك. ما رأيك في سؤال آخر؟',
            'شكراً لك على ثقتك بي! أنا متحمس لمساعدتك أكثر.'
        ],
        help: [
            'بالطبع! أنا هنا لمساعدتك. أخبرني بما تحتاجه وسأبذل قصارى جهدي لمساعدتك.',
            'أنا متاح لمساعدتك في أي وقت! ما الذي تود أن نعمل عليه معاً؟',
            'هذا ما أنا هنا من أجله! أخبرني كيف يمكنني مساعدتك اليوم.'
        ],
        question: [
            'هذا سؤال ممتاز! دعني أفكر في أفضل طريقة للإجابة عليه.',
            'سؤال مثير للاهتمام! إليك ما أفكر فيه حول هذا الموضوع...',
            'أفهم سؤالك تماماً. دعني أقدم لك إجابة شاملة ومفصلة.'
        ],
        general: [
            'شكراً لك على رسالتك! أنا هنا لمساعدتك في أي شيء تحتاجه.',
            'هذا موضوع مهم. لدي بعض الأفكار التي قد تكون مفيدة لك.',
            'أقدر وقتك في التواصل معي. إليك ما أفكر فيه...',
            'هذا موضوع معقد، لكن سأحاول تبسيطه لك.',
            'أفهم وجهة نظرك تماماً. إليك وجهة نظري حول هذا الموضوع.'
        ]
    };
    
    const message = userMessage.toLowerCase();
    
    // تحديد نوع الرسالة واختيار الاستجابة المناسبة
    if (message.includes('مرحبا') || message.includes('السلام') || message.includes('أهلا') || message.includes('هلا')) {
        return getRandomResponse(responses.greeting);
    } else if (message.includes('شكرا') || message.includes('شكراً') || message.includes('مشكور') || message.includes('متشكر')) {
        return getRandomResponse(responses.thanks);
    } else if (message.includes('مساعدة') || message.includes('ساعد') || message.includes('عايز') || message.includes('أريد')) {
        return getRandomResponse(responses.help);
    } else if (message.includes('؟') || message.includes('؟') || message.includes('كيف') || message.includes('متى') || message.includes('أين') || message.includes('لماذا')) {
        return getRandomResponse(responses.question);
    } else {
        return getRandomResponse(responses.general);
    }
}

// دالة مساعدة لاختيار استجابة عشوائية
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// إغلاق نافذة Gemini Canvas
function closeGeminiCanvas() {
    geminiCanvas.classList.add('hidden');
}

// إعداد التأثيرات البصرية
function setupVisualEffects() {
    // تأثيرات الأزرار
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // تأثيرات الإدخال
    messageInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
    });
    
    messageInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
        this.parentElement.style.boxShadow = 'none';
    });
    
    // تأثيرات الرسائل
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList.contains('message')) {
                        node.style.animation = 'messageSlide 0.5s ease-out';
                    }
                });
            }
        });
    });
    
    observer.observe(chatMessages, { childList: true });
}

// مسح المحادثة
function clearChat() {
    chatMessages.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-content">
                <div class="welcome-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h3>مرحباً! أنا Gemini AI</h3>
                <p>مساعدك الذكي للذكاء الاصطناعي. يمكنني مساعدتك في:</p>
                <div class="capabilities">
                    <div class="capability">
                        <i class="fas fa-lightbulb"></i>
                        <span>الإجابة على الأسئلة</span>
                    </div>
                    <div class="capability">
                        <i class="fas fa-code"></i>
                        <span>كتابة الكود</span>
                    </div>
                    <div class="capability">
                        <i class="fas fa-pen"></i>
                        <span>الكتابة والإبداع</span>
                    </div>
                    <div class="capability">
                        <i class="fas fa-calculator"></i>
                        <span>حل المشاكل</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// إعداد مستمع الرسائل من الإطار
window.addEventListener('message', function(event) {
    // التحقق من مصدر الرسالة
    if (event.origin !== 'https://gemini.google.com') {
        return;
    }
    
    // معالجة الرسائل الواردة من Gemini
    if (event.data && event.data.type === 'GEMINI_RESPONSE') {
        hideTypingIndicator();
        addMessage(event.data.message, 'ai');
        isProcessing = false;
        sendBtn.disabled = false;
    }
});

// معالجة الأخطاء العامة
window.addEventListener('error', function(event) {
    console.error('خطأ في التطبيق:', event.error);
});

// معالجة الأخطاء غير المعالجة
window.addEventListener('unhandledrejection', function(event) {
    console.error('خطأ غير معالج:', event.reason);
});

// تحسين الأداء - تنظيف الذاكرة
setInterval(() => {
    if (chatMessages.children.length > 50) {
        const messagesToRemove = chatMessages.children.length - 50;
        for (let i = 0; i < messagesToRemove; i++) {
            chatMessages.removeChild(chatMessages.firstChild);
        }
    }
}, 60000); // كل دقيقة

// إعدادات إضافية للتحسين
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // إيقاف العمليات عند إخفاء الصفحة
        isProcessing = false;
        sendBtn.disabled = false;
    }
});

// تحسين تجربة المستخدم
messageInput.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
});

messageInput.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
});

// إضافة تأثيرات بصرية
sendBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
});

sendBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});
