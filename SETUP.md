# تعليمات الإعداد السريع

## للتشغيل المحلي:

1. **تأكد من وجود ملف `config.js`:**
   ```bash
   ls config.js
   ```

2. **إذا لم يوجد، انسخ من المثال:**
   ```bash
   cp config.example.js config.js
   ```

3. **عدّل `config.js` وأدخل بيانات Google OAuth الحقيقية**

4. **افتح التطبيق:**
   ```bash
   # باستخدام Python
   python -m http.server 8000
   
   # أو افتح index.html مباشرة في المتصفح
   ```

## للنشر على Vercel:

1. **تأكد من وجود `config.js` محلياً**
2. **ارفع المشروع إلى Vercel**
3. **أضف متغيرات البيئة في Vercel Dashboard:**
   - `GOOGLE_CLIENT_ID`: `YOUR_GOOGLE_CLIENT_ID_HERE`
   - `GOOGLE_CLIENT_SECRET`: `YOUR_GOOGLE_CLIENT_SECRET_HERE`

## ملاحظات مهمة:

- ✅ `config.js` محمي بواسطة `.gitignore`
- ✅ لا يتم رفع الأسرار إلى GitHub
- ✅ التطبيق يعمل مع Google OAuth الحقيقي
- ✅ آمن ومتوافق مع معايير الأمان

## كيفية الحصول على بيانات Google OAuth:

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google+ API
4. أنشئ OAuth 2.0 credentials
5. أضف النطاقات المسموحة (localhost للاختبار المحلي)
6. انسخ Client ID و Client Secret إلى `config.js`
