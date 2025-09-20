# تعليمات النشر الآمن

## ✅ الخطوات الصحيحة للنشر:

### 1. إعداد متغيرات البيئة محلياً

أنشئ ملف `.env` في المجلد الجذر مع القيم الحقيقية:

```bash
# .env (لا ترفع هذا الملف إلى GitHub)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
GOOGLE_PROJECT_ID=YOUR_GOOGLE_PROJECT_ID_HERE
```

### 2. النشر على Vercel

1. **اذهب إلى [Vercel](https://vercel.com)**
2. **سجل الدخول بحساب GitHub**
3. **اضغط "New Project"**
4. **اختر المشروع من GitHub**
5. **إعدادات النشر:**
   - Framework Preset: `Other`
   - Build Command: `echo 'Static files ready'`
   - Output Directory: `.`
6. **أضف متغيرات البيئة:**
   - اذهب إلى "Project Settings" → "Environment Variables"
   - أضف:
     - `GOOGLE_CLIENT_ID`: `YOUR_GOOGLE_CLIENT_ID_HERE`
     - `GOOGLE_CLIENT_SECRET`: `YOUR_GOOGLE_CLIENT_SECRET_HERE`
     - `GOOGLE_PROJECT_ID`: `YOUR_GOOGLE_PROJECT_ID_HERE`
7. **اضغط "Deploy"**

### 3. النشر على Netlify

1. **اذهب إلى [Netlify](https://netlify.com)**
2. **سجل الدخول بحساب GitHub**
3. **اضغط "New site from Git"**
4. **اختر المشروع من GitHub**
5. **إعدادات النشر:**
   - Build command: `echo 'Static files ready'`
   - Publish directory: `.`
6. **أضف متغيرات البيئة:**
   - اذهب إلى "Site Settings" → "Environment Variables"
   - أضف:
     - `GOOGLE_CLIENT_ID`: `YOUR_GOOGLE_CLIENT_ID_HERE`
     - `GOOGLE_CLIENT_SECRET`: `YOUR_GOOGLE_CLIENT_SECRET_HERE`
     - `GOOGLE_PROJECT_ID`: `YOUR_GOOGLE_PROJECT_ID_HERE`
7. **اضغط "Deploy site"**

## 🔒 الأمان:

- ✅ لا توجد قيم سرية في الكود المرفوع
- ✅ متغيرات البيئة محمية
- ✅ المشروع آمن للنشر العام
- ✅ يعمل مع Google OAuth الحقيقي

## 📝 ملاحظات مهمة:

- **لا ترفع ملف `.env` إلى GitHub**
- **أضف متغيرات البيئة في Vercel/Netlify Dashboard**
- **المشروع يعمل مع القيم الحقيقية بعد النشر**
