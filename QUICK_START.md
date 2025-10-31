# 🚀 خطوات التنفيذ السريعة

## ✅ الخطوة 1: تشغيل Migration

### اختر واحدة من الطريقتين:

#### الطريقة 1: استخدام Batch File (أسهل)
```powershell
# في المجلد الرئيسي للمشروع
.\MIGRATION_COMMANDS.bat
```

#### الطريقة 2: تشغيل الأوامر يدوياً
```powershell
cd backend
npx prisma migrate dev --name enhance_deals_and_multi_tenant
npm run prisma:generate
```

---

## ✅ الخطوة 2: التحقق من Migration

### افتح Prisma Studio للتحقق:
```powershell
cd backend
npm run prisma:studio
```

**تحقق من:**
- ✅ Deal table يحتوي على الحقول الجديدة
- ✅ User, Property, Lead tables تحتوي على `companyId`

---

## ✅ الخطوة 3: اختبار Backend

### شغّل Backend Server:
```powershell
cd backend
npm run dev
```

### اختبر API (استخدم Postman أو curl):
```http
POST http://localhost:3050/api/deals
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "propertyId": 1,
  "brokerId": 2,
  "companyId": 1,
  "clientName": "Test Client",
  "dealType": "sale",
  "dealValue": 500000,
  "commissionRate": 0.05,
  "status": "open"
}
```

---

## ✅ الخطوة 4: المتابعة مع Frontend

بعد التأكد من أن Backend يعمل، سنقوم بـ:
1. إنشاء Deal Forms في Dashboard
2. إضافة Deals Tab
3. إضافة Reporting Tables
4. تحسين UX

---

## ⚠️ إذا واجهت مشكلة:

راجع `MIGRATION_STEPS_AR.md` للحلول.

