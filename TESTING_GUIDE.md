# 🧪 دليل شامل عن Testing (الاختبارات البرمجية)

## ما هو Testing؟

**Testing (الاختبارات)** هي عملية التحقق من أن الكود الذي تكتبه يعمل بشكل صحيح وبدون أخطاء قبل طرحه للإنتاج.

---

## 🎯 لماذا Testing مهم؟

### في مشروعك الحالي:
- ✅ **ضمان الجودة**: التأكد من أن كل ميزة تعمل كما هو متوقع
- ✅ **اكتشاف الأخطاء مبكراً**: إيجاد المشاكل قبل أن يراها المستخدمون
- ✅ **توفير الوقت**: تجنب إصلاح الأخطاء في الإنتاج (أصعب وأكثر كلفة)
- ✅ **الثقة في التحديثات**: عندما تضيف ميزة جديدة، التأكد أنك لم تكسر شيئاً قديماً
- ✅ **الاحترافية**: جميع الشركات الكبيرة تستخدم Testing

---

## 📊 أنواع Testing

### 1. **Unit Tests (اختبارات الوحدة)** 🧩
**ما هو:** اختبار كل component أو function بشكل منفصل

**مثال من مشروعك:**
```javascript
// اختبار login function
test('should login user with correct credentials', () => {
  const result = login('admin@alrabie.ae', 'admin123');
  expect(result.success).toBe(true);
  expect(result.user.email).toBe('admin@alrabie.ae');
});

// اختبار validation
test('should reject invalid email', () => {
  const result = login('invalid-email', 'password');
  expect(result.success).toBe(false);
  expect(result.error).toContain('email');
});
```

**ما يختبره:**
- ✅ Login function
- ✅ Register function
- ✅ Property validation
- ✅ Form validation
- ✅ Helper functions

---

### 2. **Integration Tests (اختبارات التكامل)** 🔗
**ما هو:** اختبار كيف تعمل أجزاء مختلفة من النظام معاً

**مثال من مشروعك:**
```javascript
// اختبار API endpoint
test('POST /api/auth/login should return token', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@alrabie.ae', password: 'admin123' });
  
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('token');
  expect(response.body.success).toBe(true);
});

// اختبار property creation
test('POST /api/properties should create property', async () => {
  const token = await getAuthToken(); // الحصول على token
  const response = await request(app)
    .post('/api/properties')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Test Property',
      price: 1000000,
      emirate: 'Ajman'
    });
  
  expect(response.status).toBe(201);
  expect(response.body.property).toHaveProperty('id');
});
```

**ما يختبره:**
- ✅ API endpoints
- ✅ Database operations
- ✅ Authentication flow
- ✅ Property CRUD operations
- ✅ User management

---

### 3. **E2E Tests (End-to-End Tests)** 🌐
**ما هو:** اختبار التطبيق بالكامل من منظور المستخدم النهائي

**مثال من مشروعك:**
```javascript
// اختبار سيناريو كامل: تسجيل الدخول و إضافة عقار
test('User can login and add property', async () => {
  // 1. فتح الصفحة
  await page.goto('http://localhost:3000');
  
  // 2. الضغط على Login
  await page.click('text=Login');
  
  // 3. إدخال البيانات
  await page.fill('input[name="email"]', 'broker@alrabie.ae');
  await page.fill('input[name="password"]', 'broker123');
  
  // 4. الضغط على Submit
  await page.click('button[type="submit"]');
  
  // 5. التحقق من نجاح Login
  await expect(page).toHaveURL(/.*\/broker\/dashboard/);
  
  // 6. الذهاب إلى Add Property
  await page.click('text=Add Property');
  
  // 7. ملء النموذج
  await page.fill('input[name="title"]', 'Luxury Villa');
  await page.fill('input[name="price"]', '2000000');
  
  // 8. حفظ
  await page.click('button:has-text("Add Property")');
  
  // 9. التحقق من النجاح
  await expect(page).toHaveText('Property added successfully');
});
```

**ما يختبره:**
- ✅ سيناريوهات المستخدم الكاملة
- ✅ Navigation بين الصفحات
- ✅ Forms وsubmission
- ✅ User flows (مثل: Register → Login → Add Property)

---

## 🛠️ الأدوات المستخدمة في Testing

### للمشاريع JavaScript/React:

1. **Jest** - للـ Unit و Integration Tests
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

2. **React Testing Library** - لاختبار React Components
```bash
npm install --save-dev @testing-library/react @testing-library/user-event
```

3. **Supertest** - لاختبار API endpoints
```bash
npm install --save-dev supertest
```

4. **Playwright** أو **Cypress** - للـ E2E Tests
```bash
npm install --save-dev @playwright/test
```

---

## 📝 مثال عملي: إضافة Tests لمشروعك

### 1. إعداد Jest

**`frontend-next/jest.config.js`:**
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

**`frontend-next/jest.setup.js`:**
```javascript
import '@testing-library/jest-dom'
```

### 2. Unit Test Example - Login Modal

**`frontend-next/components/auth/__tests__/LoginModal.test.jsx`:**
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../../contexts/AuthContext';
import LoginModal from '../LoginModal';

// Mock axios
jest.mock('../../../lib/api/axios-client', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('LoginModal', () => {
  it('should render login form', () => {
    render(
      <AuthProvider>
        <LoginModal isOpen={true} onClose={() => {}} />
      </AuthProvider>
    );
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show validation error for invalid email', async () => {
    render(
      <AuthProvider>
        <LoginModal isOpen={true} onClose={() => {}} />
      </AuthProvider>
    );
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('should call login function with correct credentials', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ success: true });
    
    render(
      <AuthProvider>
        <LoginModal isOpen={true} onClose={() => {}} />
      </AuthProvider>
    );
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'admin@alrabie.ae' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(submitButton);
    
    // التحقق من أن login تم استدعاؤه
    // (سيعتمد على implementation الخاص بك)
  });
});
```

### 3. Integration Test Example - API

**`backend/routes/__tests__/auth.test.js`:**
```javascript
const request = require('supertest');
const app = require('../../start-server');

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@alrabie.ae',
        password: 'admin123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe('admin@alrabie.ae');
  });

  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@alrabie.ae',
        password: 'wrong-password'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Invalid');
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: '',
        password: ''
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
```

### 4. E2E Test Example - Playwright

**`frontend-next/e2e/login-flow.spec.js`:**
```javascript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully and redirect to dashboard', async ({ page }) => {
    // Go to homepage
    await page.goto('http://localhost:3000');

    // Click Login button
    await page.click('text=Login');

    // Fill login form
    await page.fill('input[name="email"]', 'admin@alrabie.ae');
    await page.fill('input[name="password"]', 'admin123');

    // Submit
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL('**/*');

    // Verify login success (check for user menu or dashboard)
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=Login');

    await page.fill('input[name="email"]', 'wrong@email.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Wait for error message
    await expect(page.locator('text=/invalid/i')).toBeVisible();
  });
});
```

---

## 📊 Coverage (التغطية)

**Coverage** = نسبة الكود الذي تم اختباره

**مثال:**
- **90% Coverage** = 90% من الكود تم اختباره ✅
- **50% Coverage** = 50% من الكود تم اختباره ⚠️
- **0% Coverage** = لا يوجد اختبارات ❌

**هدف جيد:** 70-80% coverage على الأقل للكود المهم

---

## 🚀 كيفية إضافة Tests لمشروعك

### الخطوات:

1. **تثبيت الأدوات:**
```bash
cd frontend-next
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

```bash
cd backend
npm install --save-dev jest supertest
```

2. **إنشاء ملفات الإعداد** (كما في الأمثلة أعلاه)

3. **إضافة scripts في package.json:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

4. **كتابة أول test:**
- ابدأ باختبار بسيط (مثل validation)
- ثم انتقل إلى components
- ثم API endpoints

5. **تشغيل Tests:**
```bash
npm test              # تشغيل جميع الاختبارات
npm run test:watch    # تشغيل في watch mode
npm run test:coverage # مع تقرير التغطية
```

---

## 💡 نصائح مهمة

1. **ابدأ صغيراً**: اكتب tests للميزات الأكثر أهمية أولاً
2. **Test ما يهم المستخدم**: ركز على User flows الرئيسية
3. **Maintainable tests**: اكتب tests سهلة القراءة والصيانة
4. **Fast feedback**: Tests يجب أن تكون سريعة
5. **Independent**: كل test يجب أن يكون مستقلاً

---

## 📈 الفوائد في مشروعك

### قبل Testing:
- ❌ لا تعرف إذا كان الكود يعمل بعد التحديث
- ❌ الأخطاء تظهر فقط في الإنتاج
- ❌ الخوف من تحديث أو إضافة ميزات جديدة
- ❌ صعوبة في إصلاح الأخطاء

### بعد Testing:
- ✅ ثقة في التحديثات
- ✅ اكتشاف الأخطاء مبكراً
- ✅ كود أكثر استقراراً
- ✅ سهولة في الإصلاح

---

## 🎯 الخطوة التالية

لإضافة Testing لمشروعك:

1. **ابدأ بـ Unit Tests** للـ validation functions
2. **ثم Integration Tests** للـ API endpoints
3. **أخيراً E2E Tests** للمسارات الرئيسية

**هل تريد أن أساعدك في إضافة أول test لمشروعك؟** 🚀

