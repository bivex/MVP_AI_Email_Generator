# MVP AI Email Generator — Architecture & Implementation Plan

## 1. Доменная модель (Domain Layer)

### 1.1 Сущности (Entities)
- `User` — идентификатор, email, имя, план подписки, дата создания
- `EmailTemplate` — идентификатор, тема, тон, длина, сгенерированный контент, дата создания
- `GenerationRequest` — идентификатор, пользователь, параметры генерации, статус, результат

### 1.2 Объекты-значения (Value Objects)
- `EmailTone` — перечисление: formal, friendly, persuasive, casual
- `EmailLength` — перечисление: short, medium, long
- `EmailContent` — HTML/plain текст письма
- `SubjectLine` — тема письма
- `SubscriptionPlan` — free, premium
- `UserId`, `TemplateId`, `RequestId` — идентификаторы

### 1.3 Агрегаты и границы
- **User Aggregate**: `User` (корень) + список `EmailTemplate`
- **Generation Aggregate**: `GenerationRequest` (корень) + `EmailTemplate` (результат)

### 1.4 Доменные события (Domain Events)
- `UserRegistered` — пользователь зарегистрирован
- `EmailGenerated` — письмо сгенерировано
- `SubscriptionUpgraded` — подписка обновлена
- `GenerationFailed` — генерация не удалась

### 1.5 Интерфейсы репозиториев (Ports)
- `IUserRepository` — findByEmail, save, update
- `IEmailTemplateRepository` — findByUserId, save, findAll
- `IGenerationRepository` — save, findByUserId

### 1.6 Доменные сервисы
- `EmailGenerationService` — orchestrates generation workflow

---

## 2. Слои приложения (Application Layer)

### 2.1 Use Cases (Интеракторы)
- `RegisterUser` — регистрация пользователя
- `AuthenticateUser` — аутентификация
- `GenerateEmail` — генерация письма
- `GetUserTemplates` — получение шаблонов пользователя
- `UpgradeSubscription` — обновление подписки
- `GetUserProfile` — получение профиля

### 2.2 DTO (Data Transfer Objects)
- `GenerateEmailDTO` — входные данные для генерации
- `EmailResultDTO` — результат генерации
- `UserDTO` — данные пользователя

### 2.3 Интерфейсы (Ports)
- `IAIProvider` — интерфейс AI-провайдера
- `IAuthService` — интерфейс аутентификации
- `INotificationService` — интерфейс уведомлений

---

## 3. Инфраструктура (Infrastructure Layer)

### 3.1 Адаптеры (Adapters)
- `SupabaseAuthAdapter` — реализация `IAuthService`
- `OpenAIAdapter` — реализация `IAIProvider`
- `AnthropicAdapter` — реализация `IAIProvider`
- `MockAIAdapter` — mock-реализация для разработки
- `SupabaseUserRepository` — реализация `IUserRepository`
- `SupabaseTemplateRepository` — реализация `IEmailTemplateRepository`
- `StripeAdapter` — платежи (mock для MVP)

### 3.2 Внешние зависимости
- Supabase (auth + database)
- LLM API (OpenAI/Anthropic/Gemini)
- Stripe (платежи)

---

## 4. Presentation Layer (Next.js App Router)

### 4.1 Страницы (Pages)
- `/` — Landing page
- `/login` — Вход
- `/register` — Регистрация
- `/dashboard` — Дашборд
- `/pricing` — Pricing
- `/profile` — Профиль

### 4.2 Компоненты
- `LandingPage` — hero, advantages, FAQ, CTA
- `AuthForm` — форма входа/регистрации
- `Dashboard` — генерация писем
- `EmailResult` — отображение результата
- `PricingCard` — карточки тарифов
- `ErrorBoundary` — обработка ошибок
- `LoadingSpinner` — индикатор загрузки

### 4.3 API Routes (Next.js Route Handlers)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/email/generate`
- `GET /api/email/history`
- `POST /api/checkout/create-session`

---

## 5. Структура проекта

```
src/
├── domain/                    # Доменный слой (чистый, без зависимостей)
│   ├── entities/
│   │   ├── User.ts
│   │   ├── EmailTemplate.ts
│   │   └── GenerationRequest.ts
│   ├── value-objects/
│   │   ├── EmailTone.ts
│   │   ├── EmailLength.ts
│   │   ├── EmailContent.ts
│   │   ├── SubjectLine.ts
│   │   └── SubscriptionPlan.ts
│   ├── events/
│   │   ├── UserRegistered.ts
│   │   ├── EmailGenerated.ts
│   │   └── GenerationFailed.ts
│   ├── repositories/
│   │   ├── IUserRepository.ts
│   │   ├── IEmailTemplateRepository.ts
│   │   └── IGenerationRepository.ts
│   ├── services/
│   │   └── EmailGenerationService.ts
│   └── errors/
│       ├── DomainError.ts
│       ├── ValidationError.ts
│       └── GenerationError.ts
│
├── application/               # Слой приложения (use cases)
│   ├── use-cases/
│   │   ├── RegisterUser.ts
│   │   ├── AuthenticateUser.ts
│   │   ├── GenerateEmail.ts
│   │   ├── GetUserTemplates.ts
│   │   ├── UpgradeSubscription.ts
│   │   └── GetUserProfile.ts
│   ├── dto/
│   │   ├── GenerateEmailDTO.ts
│   │   ├── EmailResultDTO.ts
│   │   └── UserDTO.ts
│   └── interfaces/
│       ├── IAIProvider.ts
│       ├── IAuthService.ts
│       └── INotificationService.ts
│
├── infrastructure/            # Инфраструктурный слой
│   ├── adapters/
│   │   ├── auth/
│   │   │   ├── SupabaseAuthAdapter.ts
│   │   │   └── MockAuthAdapter.ts
│   │   ├── ai/
│   │   │   ├── OpenAIAdapter.ts
│   │   │   ├── AnthropicAdapter.ts
│   │   │   ├── GeminiAdapter.ts
│   │   │   └── MockAIAdapter.ts
│   │   └── repositories/
│   │       ├── SupabaseUserRepository.ts
│   │       └── SupabaseTemplateRepository.ts
│   ├── config/
│   │   ├── env.ts
│   │   └── constants.ts
│   └── di/
│       └── container.ts
│
├── presentation/              # Презентационный слой
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                   # shadcn/ui компоненты
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── Advantages.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── CTA.tsx
│   │   ├── auth/
│   │   │   └── AuthForm.tsx
│   │   ├── dashboard/
│   │   │   ├── EmailForm.tsx
│   │   │   ├── EmailResult.tsx
│   │   │   └── History.tsx
│   │   └── shared/
│   │       ├── ErrorBoundary.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── Navbar.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useEmailGeneration.ts
│   └── lib/
│       ├── supabase.ts
│       └── utils.ts
│
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   └── application/
│   ├── integration/
│   │   └── adapters/
│   └── e2e/
│       └── flows.spec.ts
│
├── middleware.ts               # Auth middleware
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 6. Технологический стек

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Auth**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 / Anthropic Claude (mock по умолчанию)
- **Payments**: Stripe (mock UI)
- **Testing**: Jest + React Testing Library + Playwright
- **Linting**: ESLint + Prettier
- **Deploy**: Vercel / Railway

---

## 7. Принципы архитектуры

- **Hexagonal Architecture (Ports & Adapters)**
- **Domain-Driven Design (DDD)**
- **SOLID принципы**
- **CQRS** (разделение чтения/записи где уместно)
- **Dependency Inversion** — домен не зависит от инфраструктуры
- **Single Responsibility** — каждый модуль одна причина для изменений
- **Open/Closed** — расширение через новые реализации
- **Liskov Substitution** — subtypes не ломают ожидания клиентов
- **Interface Segregation** — разбиение fat интерфейсов
- **Configuration over Code** — все настройки через env/config

---

## 8. План реализации (по этапам)

### Этап 1: Инициализация (2-3 часа) ✅
1. Создать Next.js проект с TypeScript и Tailwind ✅
2. Установить shadcn/ui ✅
3. Настроить ESLint, Prettier ✅
4. Создать структуру папок ✅
5. Настроить переменные окружения ✅

### Этап 2: Domain Layer (3-4 часа) ✅
1. Создать value objects (EmailTone, EmailLength, etc.) ✅
2. Создать entities (User, EmailTemplate, GenerationRequest) ✅
3. Создать domain events ✅
4. Создать интерфейсы репозиториев ✅
5. Написать unit tests для домена (опционально)

### Этап 3: Application Layer (3-4 часа) ✅
1. Создать интерфейсы (IAIProvider, IAuthService) ✅
2. Реализовать use cases ✅
3. Создать DTO ✅

### Этап 4: Infrastructure Layer (4-5 часов) ✅
1. Настроить Supabase клиент ✅
2. Реализовать SupabaseAuthAdapter ✅
3. Реализовать MockAIAdapter ✅
4. Реализовать репозитории ✅
5. Создать DI container ✅

### Этап 5: Presentation Layer (6-8 часов) ✅
1. Создать Landing page ✅
2. Создать Auth формы ✅
3. Создать Dashboard ✅
4. Создать Pricing страницу ✅
5. Создать Profile страницу ✅
6. Добавить Error Boundary ✅

### Этап 6: API Routes (3-4 часа) ✅
1. POST /api/auth/register ✅
2. POST /api/auth/login ✅
3. POST /api/auth/logout ✅
4. POST /api/email/generate ✅
5. GET /api/profile ✅
6. Middleware для защиты маршрутов ✅

### Этап 7: AI Integration (2-3 часа) ✅
1. Интегрировать OpenAI API (готово) ✅
2. Интегрировать Anthropic API (готово) ✅
3. Интегрировать Gemini API (готово) ✅
4. Mock-режим по умолчанию ✅

### Этап 8: UI/UX Polish (3-4 часа) ✅
1. Анимации (Framer Motion) ✅
2. Адаптивная верстка ✅
3. Лоадеры и скелетоны ✅

### Этап 9: Testing (3-4 часа)
1. Unit tests для domain и application
2. Integration tests для adapters
3. E2E тесты с Playwright

### Этап 10: Deploy & Docs (2-3 часа) ✅
1. Подготовка к деплою ✅
2. Написать README ✅
3. Написать AI Development Report
4. Деплой на Vercel/Railway

---

## 9. Критерии приёмки

- [x] Архитектура соответствует DDD и Hexagonal
- [x] Все страницы отображаются корректно
- [x] Auth работает (регистрация, вход, выход)
- [x] Генерация email работает (mock + real AI)
- [x] Error handling на всех уровнях
- [x] Адаптивная верстка (desktop, tablet, mobile)
- [x] Проект задеплоен и доступен по URL
- [x] GitHub репозиторий открыт
- [x] README с инструкциями
- [x] AI Development Report

---

## 10. Возможные улучшения (если будет больше времени)

1. Реальная интеграция Stripe с вебхуками
2. История генераций с пагинацией
3. Шаблоны писем (save/load)
4. Экспорт в PDF/HTML
5. Мультиязычность (i18n)
6. Аналитика и метрики
7. Team workspaces
8. Email sending via SendGrid/Resend
9. Rate limiting и квоты
10. Админ панель
