# محادثة ذكاء اصطناعي - Gemini AI Chat

تطبيق ويب متقدم للمحادثة مع الذكاء الاصطناعي باستخدام Gemini Canvas مع تسجيل الدخول عبر Google.

## الميزات

- 🔐 تسجيل الدخول الآمن عبر Google OAuth
- 🤖 محادثة ذكية مع Gemini AI
- 💬 واجهة مستخدم حديثة ومتجاوبة
- 📱 تصميم متجاوب لجميع الأجهزة
- 🎨 تصميم عربي جميل ومتطور
- ⚡ أداء سريع ومرن

## التقنيات المستخدمة

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Google OAuth 2.0
- Gemini Canvas Integration
- Font Awesome Icons
- Google Fonts (Cairo)

## التثبيت والتشغيل

### التشغيل المحلي

1. **استنساخ المشروع:**
   ```bash
   git clone https://github.com/5dpj/5555.git
   cd project2
   ```

2. **إعداد Google OAuth:**
   ```bash
   # انسخ ملف المثال
   cp config.example.js config.js
   
   # أو استخدم متغيرات البيئة (الأفضل)
   cp env.example .env
   # عدّل ملف .env وأدخل بيانات Google OAuth الحقيقية
   ```

3. **فتح المشروع:**
   - افتح ملف `index.html` في متصفح الويب
   - أو استخدم خادم ويب محلي:
   ```bash
   # باستخدام Python
   python -m http.server 8000
   
   # باستخدام Node.js
   npx serve .
   ```

4. **الوصول للتطبيق:**
   - افتح المتصفح واذهب إلى `http://localhost:8000`
   - أو افتح `index.html` مباشرة

### النشر على Vercel

1. **ربط المشروع بـ Vercel:**
   - اذهب إلى [Vercel](https://vercel.com)
   - سجل الدخول بحساب GitHub
   - اضغط على "New Project"
   - اختر المشروع من GitHub

2. **إعدادات النشر:**
   - Framework Preset: Other
   - Build Command: `echo 'Static files ready'`
   - Output Directory: `.`
   - Install Command: `npm install`

3. **النشر:**
   - اضغط على "Deploy"
   - انتظر حتى يكتمل النشر
   - احصل على الرابط المباشر للتطبيق

## كيفية الاستخدام

1. **تسجيل الدخول:**
   - اضغط على "تسجيل الدخول عبر Google"
   - اختر حساب Google الخاص بك
   - انتظر تأكيد تسجيل الدخول

2. **بدء المحادثة:**
   - اكتب رسالتك في حقل النص
   - اضغط Enter أو زر الإرسال
   - استمتع بالمحادثة مع الذكاء الاصطناعي

3. **التحكم:**
   - استخدم زر تسجيل الخروج للخروج من التطبيق
   - يمكنك إغلاق نافذة Gemini Canvas في أي وقت

## إعدادات Google OAuth

### الطريقة الآمنة (متغيرات البيئة):

1. **انسخ ملف المثال:**
   ```bash
   cp env.example .env
   ```

2. **عدّل ملف `.env` وأدخل بياناتك الحقيقية:**
   ```bash
   GOOGLE_CLIENT_ID=your_actual_client_id
   GOOGLE_CLIENT_SECRET=your_actual_client_secret
   GOOGLE_PROJECT_ID=your_actual_project_id
   ```

### الطريقة التقليدية (config.js):

انسخ `config.example.js` إلى `config.js` وأدخل بياناتك الحقيقية.

**⚠️ تحذير:** لا ترفع ملف `config.js` أو `.env` إلى GitHub!

## هيكل المشروع

```
gemini-ai-chat/
├── index.html          # الصفحة الرئيسية
├── styles.css          # ملف التنسيقات
├── script.js           # ملف JavaScript الرئيسي
├── README.md           # ملف التوثيق
└── .gitignore          # ملف تجاهل Git
```

## المتطلبات

- متصفح ويب حديث (Chrome, Firefox, Safari, Edge)
- اتصال بالإنترنت
- حساب Google صالح

## الأمان

- جميع البيانات محفوظة محلياً في المتصفح
- لا يتم إرسال معلومات شخصية إلى خوادم خارجية
- استخدام HTTPS لجميع طلبات OAuth

## المساهمة

نرحب بمساهماتكم! يرجى:

1. عمل Fork للمشروع
2. إنشاء فرع جديد للميزة (`git checkout -b feature/AmazingFeature`)
3. عمل Commit للتغييرات (`git commit -m 'Add some AmazingFeature'`)
4. رفع الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

إذا واجهت أي مشاكل أو لديك اقتراحات، يرجى:

- فتح Issue جديد
- التواصل معنا عبر البريد الإلكتروني
- مراجعة الوثائق

## التحديثات المستقبلية

- [ ] دعم لغات متعددة
- [ ] حفظ تاريخ المحادثات
- [ ] مشاركة المحادثات
- [ ] إعدادات متقدمة
- [ ] دعم الملفات والصور
- [ ] وضع ليلي

---

تم تطوير هذا المشروع بـ ❤️ باستخدام أحدث تقنيات الويب
