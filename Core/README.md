# SAQR ERP - Backend Documentation

## 📋 نظرة عامة

قسم Backend للنظام مبني على **NestJS** وهو إطار عمل قوي وسريع لبناء تطبيقات Node.js.

## 🏗️ الهيكل المعماري

```
Core/
├── src/
│   ├── main.ts                 # نقطة دخول التطبيق
│   ├── app.module.ts           # الوحدة الرئيسية
│   ├── app.controller.ts       # المتحكمات الرئيسية
│   ├── app.service.ts          # الخدمات الرئيسية
│   ├── entities/               # كيانات قاعدة البيانات
│   │   ├── user.entity.ts
│   │   └── project.entity.ts
│   └── services/               # خدمات العمل
│       ├── auth.service.ts
│       └── user.service.ts
├── package.json
├── tsconfig.json
└── Dockerfile
```

## 🚀 البدء السريع

### التثبيت:
```
bash
cd Core
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

## 📊 API Endpoints

### الحالة والصحة:
- `GET /` - رسالة ترحيب
- `GET /api/status` - حالة الخادم
- `GET /api/health` - فحص الصحة

### المستخدمين (قيد التطوير):
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/register` - التسجيل
- `GET /api/users` - قائمة المستخدمين
- `GET /api/users/:id` - بيانات المستخدم
- `PUT /api/users/:id` - تحديث المستخدم
- `DELETE /api/users/:id` - حذف المستخدم

## 🔐 المصادقة

سيتم تنفيذ المصادقة باستخدام JWT (JSON Web Tokens).

## 📦 المكتبات الرئيسية

- `@nestjs/core` - مقدم NestJS
- `@nestjs/common` - الديكوريتورز والأدوات الشائعة
- `typeorm` - ORM لإدارة قاعدة البيانات
- `pg` - مشغل PostgreSQL