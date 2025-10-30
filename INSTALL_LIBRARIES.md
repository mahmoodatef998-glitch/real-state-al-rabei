# 🚀 خطوات تثبيت المكتبات المطلوبة

## 📍 المسارات الكاملة

### Frontend (Next.js)
```
C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\frontend-next
```

### Backend (Node.js)
```
C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend
```

---

## 📦 المكتبات المطلوبة

### 1. Frontend - Zod (للـ Validation)
### 2. Backend - express-validator (للـ Server-side Validation)

---

## 🛠️ طريقة التثبيت

### ✅ الطريقة الأولى: باستخدام Terminal/PowerShell

#### الخطوة 1: تثبيت Zod للـ Frontend
افتح **PowerShell** أو **Command Prompt** وقم بتشغيل:

```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\frontend-next"
npm install zod
```

أو إذا واجهت مشاكل مع peer dependencies:
```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\frontend-next"
npm install zod --legacy-peer-deps
```

---

#### الخطوة 2: تثبيت express-validator للـ Backend
افتح **PowerShell** جديد (أو انتظر انتهاء الأول) وقم بتشغيل:

```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
npm install express-validator
```

---

### ✅ الطريقة الثانية: استخدام ملف Batch (أسهل)

انسخ الكود التالي وضعه في ملف اسمه `install-libraries.bat` في المجلد الرئيسي:

```batch
@echo off
echo ========================================
echo Installing Required Libraries...
echo ========================================
echo.

echo [1/2] Installing Zod for Frontend...
cd frontend-next
call npm install zod --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Error installing Zod!
    pause
    exit /b 1
)
echo ✓ Zod installed successfully!
echo.

echo [2/2] Installing express-validator for Backend...
cd ..\backend
call npm install express-validator
if %errorlevel% neq 0 (
    echo Error installing express-validator!
    pause
    exit /b 1
)
echo ✓ express-validator installed successfully!
echo.

cd ..
echo ========================================
echo All libraries installed successfully! ✓
echo ========================================
pause
```

ثم:
1. انقر نقراً مزدوجاً على `install-libraries.bat`
2. انتظر حتى ينتهي التثبيت

---

## 🔍 التحقق من التثبيت

### للتحقق من Zod (Frontend):
```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\frontend-next"
npm list zod
```

يجب أن ترى:
```
alrabie-real-estate-next@0.1.0
└── zod@3.x.x
```

### للتحقق من express-validator (Backend):
```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
npm list express-validator
```

يجب أن ترى:
```
alrabie-real-estate-backend@1.0.0
└── express-validator@7.x.x
```

---

## ⚠️ حل مشاكل التثبيت

### إذا واجهت مشكلة "peer dependencies":

#### للـ Frontend:
```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\frontend-next"
npm install zod --legacy-peer-deps
```

#### للـ Backend:
```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
npm install express-validator --legacy-peer-deps
```

---

### إذا واجهت مشكلة "permission denied":
- شغل PowerShell كـ Administrator
- أو استخدم `sudo` (في Git Bash)

---

## ✅ بعد التثبيت

بعد إكمال التثبيت بنجاح، أخبرني وسأكمل إضافة:
- ✅ Validation للـ Forms باستخدام Zod
- ✅ Server-side Validation باستخدام express-validator
- ✅ باقي التحسينات

---

## 📝 ملاحظات

- ⏱️ **الوقت المتوقع**: 1-2 دقيقة لكل مكتبة
- 💾 **المساحة المطلوبة**: ~5-10 MB لكل مكتبة
- 🔄 **لا تحتاج إعادة تشغيل** بعد التثبيت

