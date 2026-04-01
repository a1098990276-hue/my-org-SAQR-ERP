# SAQR ERP - Frontend Documentation

## 📋 نظرة عامة

قسم Frontend للنظام مبني على **Next.js** وهو إطار عمل React قوي لبناء تطبيقات ويب سريعة.

## 🏗️ الهيكل المعماري

```
UI/
├── pages/
│   ├── index.tsx               # الصفحة الرئيسية
│   ├── _app.tsx                # التطبيق الرئيسي
│   ├── login.tsx               # صفحة تسجيل الدخول (قريباً)
│   ├── register.tsx            # صفحة التسجيل (قريباً)
│   └── dashboard/              # لوحة التحكم (قريباً)
├── components/                 # المكونات القابلة لإعادة الاستخدام
├── styles/                     # ملفات CSS
├── utils/                      # دوال المساعدة
├── next.config.js
├── tsconfig.json
└── Dockerfile
```

## 🚀 البدء السريع

### التثبيت:
```
bash
cd UI
npm install
```

### التطوير:
```
bash
npm run dev
```

### البناء:
```
bash
npm run build
```

### الإنتاج:
```
bash
npm start
```

## 📄 الصفحات المتاحة

### الصفحات الحالية:
- `/` - الصفحة الرئيسية (مكتملة)

### الصفحات قيد التطوير:
- `/login` - صفحة تسجيل الدخول
- `/register` - ��فحة التسجيل
- `/dashboard` - لوحة التحكم
- `/users` - إدارة المستخدمين
- `/projects` - إدارة المشاريع
- `/reports` - التقارير

## 🎨 التصميم والأسلوب

يتم استخدام:
- **React** - مكتبة واجهات المستخدم
- **Next.js** - إطار عمل React
- **CSS-in-JS** - تنسيق الأنماط
- **TypeScript** - نوع من JavaScript آمن
