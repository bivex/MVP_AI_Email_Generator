# AI Email Generator

MVP-приложение для генерации профессиональных email-сообщений с помощью AI.
Пользователь указывает тему, выбирает тон и длину — получает готовый текст письма.

> Сдано как тестовое задание «Vibe Coder / AI-First Developer». Полный отчёт
> об AI-разработке см. в [AI_DEVELOPMENT_REPORT.md](./AI_DEVELOPMENT_REPORT.md).

---

## 🚀 Демо

- **Live URL:** _(заполняется после деплоя на Vercel)_
- **GitHub:** _(заполняется после публикации репозитория)_

---

## 🧰 Технологии

| Слой | Технология |
|------|-----------|
| Фреймворк | **Next.js 16** (App Router) + **TypeScript** |
| UI | **Tailwind CSS v4** + компоненты в стиле **shadcn/ui** |
| Анимации | **Framer Motion** |
| Аутентификация | **Supabase Auth** |
| База данных | **Supabase** (PostgreSQL + Row Level Security) |
| AI | **OpenAI / Anthropic / Gemini** + встроенный **mock-режим** |
| Платежи | Flow для **Stripe** (UI готов, интеграция опциональна) |
| Тесты | **Vitest** |
| Линт/формат | **ESLint** + **Prettier** |

---

## 🏗️ Архитектура

Проект построен по **Domain-Driven Design (DDD)** и **Hexagonal Architecture
(Ports & Adapters)**. Доменный слой изолирован от фреймворка и инфраструктуры,
что позволяет легко заменять AI-провайдеров, БД и систему авторизации.

```
src/
├── domain/                  # Чистая доменная логика (0 зависимостей от фреймворка)
│   ├── entities/            # User, EmailTemplate, GenerationRequest
│   ├── value-objects/       # EmailTone, EmailLength, SubjectLine, ...
│   ├── events/              # Доменные события
│   ├── repositories/        # Интерфейсы репозиториев (ports)
│   └── errors/              # DomainError, ValidationError, GenerationError
│
├── application/             # Сценарии использования (use cases)
│   ├── use-cases/           # RegisterUser, GenerateEmail, UpgradeSubscription, ...
│   ├── dto/                 # Data Transfer Objects
│   └── interfaces/          # IAIProvider, IAuthService (ports)
│
├── infrastructure/          # Реализации интерфейсов (adapters)
│   ├── adapters/
│   │   ├── auth/            # SupabaseAuthAdapter
│   │   ├── ai/              # MockAIAdapter, OpenAIAdapter, AnthropicAdapter, GeminiAdapter
│   │   └── repositories/    # Supabase*Repository
│   ├── config/              # env, constants
│   ├── db/                  # Автоинициализация схемы БД
│   └── di/                  # DI-контейнер
│
└── app/                     # Presentation layer (Next.js App Router)
    ├── page.tsx             # Landing (Hero, преимущества, FAQ, CTA)
    ├── login | register     # Аутентификация
    ├── dashboard/           # Генерация писем
    ├── pricing/             # Тарифы + кнопка Upgrade
    ├── profile/             # Профиль пользователя
    ├── api/                 # Route handlers
    ├── error.tsx            # Error boundary уровня приложения
    ├── global-error.tsx     # Error boundary уровня root layout
    ├── not-found.tsx        # Кастомная 404
    └── loading.tsx          # UI загрузки
```

**Принципы:** Dependency Inversion, Single Responsibility, Open/Closed.
Подробно — в [PLAN.md](./PLAN.md).

---

## ✨ Функциональность

- **Landing page** — Hero, описание сервиса, блок преимуществ, FAQ, CTA, адаптив.
- **Аутентификация** — регистрация, вход, выход (Supabase Auth).
- **Dashboard** — поле темы, выбор тона (formal/friendly/persuasive/casual),
  выбор длины (short/medium/long), кнопка Generate, отображение результата, copy.
- **AI-генерация** — переключаемый провайдер: mock (по умолчанию, без API-ключа),
  OpenAI, Anthropic, Gemini.
- **Pricing** — страница тарифов с кнопкой Upgrade (flow готов, Stripe опционален).
- **Profile** — минимальная страница профиля.
- **Error handling** — `error.tsx`, `global-error.tsx`, `not-found.tsx`,
  `loading.tsx` — белых экранов нет.
- **Responsive** — Desktop / Tablet / Mobile на Tailwind.

---

## 📦 Установка и запуск

### Требования

- Node.js 18+
- npm
- Аккаунт [Supabase](https://supabase.com) (бесплатного тарифа достаточно)

### Шаги

1. **Клонировать репозиторий**
   ```bash
   git clone <repository-url>
   cd mvp-ai-email-generator
   ```

2. **Установить зависимости**
   ```bash
   npm install
   ```

3. **Настроить переменные окружения**
   ```bash
   cp .env.example .env
   ```
   Заполните в `.env` как минимум `NEXT_PUBLIC_SUPABASE_URL` и
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`. AI-ключи опциональны — по умолчанию
   работает mock-режим.

4. **Создать схему БД в Supabase**
   - Откройте SQL Editor в проекте Supabase
   - Выполните скрипт из [`supabase/schema.sql`](./supabase/schema.sql)
   - (Опционально) выполните [`supabase/rls-policies-fix.sql`](./supabase/rls-policies-fix.sql)
     — безопасные fallback-политики RLS для `public.users`

5. **Настроить URLs для email-подтверждения в Supabase**
   Без этого кнопка «Confirm email address» в письме регистрации ведёт не туда.
   В Supabase Dashboard → **Authentication → URL Configuration**:
   - **Site URL** = `https://mvp-ai-email-generator.vercel.app`
     (на локалке — `http://localhost:8364`)
   - **Redirect URLs** (add both):
     - `https://mvp-ai-email-generator.vercel.app/auth/callback`
     - `http://localhost:8364/auth/callback`
   После клика по ссылке из письма пользователь попадёт на `/auth/callback`,
   который обменяет код на сессию и редиректнет на `/dashboard`.

5. **Запустить dev-сервер**
   ```bash
   npm run dev
   ```
   Приложение будет доступно по адресу
   **[http://localhost:8364](http://localhost:8364)**

   > ⚠️ Порт `8364` (см. `package.json` → `scripts.dev`), а не стандартный 3000.

---

## 🔑 Переменные окружения

| Переменная | Обязательная | Описание |
|-----------|:---:|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL проекта Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Anon (public) ключ Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ | Service-role ключ — обходит RLS при server-side upsert пользователя |
| `SUPABASE_DB_PASSWORD` | — | Пароль БД (для автоинициализации схемы) |
| `AI_PROVIDER` | — | `mock` (по умолчанию) / `openai` / `anthropic` / `gemini` |
| `OPENAI_API_KEY` | — | Ключ OpenAI |
| `ANTHROPIC_API_KEY` | — | Ключ Anthropic |
| `GOOGLE_AI_API_KEY` | — | Ключ Google AI (Gemini) |
| `NEXT_PUBLIC_APP_URL` | — | Базовый URL приложения |

---

## 🤖 AI-провайдеры

Провайдер выбирается переменной `AI_PROVIDER` в `.env`:

| Значение | Поведение |
|----------|-----------|
| `mock` *(по умолчанию)* | Готовые шаблоны писем, **без API-ключа**. Идеально для демо/тестов. |
| `openai` | OpenAI GPT-4 |
| `anthropic` | Anthropic Claude |
| `gemini` | Google Gemini |

Все провайдеры реализуют единый интерфейс `IAIProvider`, поэтому замена mock
на реальную модель — это смена одной переменной окружения.

---

## 🧪 Тесты

```bash
npm test        # запуск unit-тестов (vitest)
npm run test:watch
```

Покрытие:
- **Domain layer** — value objects (`SubjectLine`, `EmailContent`, ID-классы),
  entities (`User`, `EmailTemplate`, `GenerationRequest`) — инварианты и
  переходы состояний.
- **Application layer** — use case `GenerateEmail` с mock-репозиториями
  (happy path + обработка ошибки провайдера).

---

## 🛠️ Скрипты

| Команда | Описание |
|--------|-----------|
| `npm run dev` | Dev-сервер (порт 8364) |
| `npm run build` | Production-сборка |
| `npm start` | Запуск production-сборки |
| `npm run lint` | ESLint |
| `npm run typecheck` | Проверка типов TypeScript |
| `npm run format` | Prettier |
| `npm test` | Запуск тестов |

---

## ☁️ Деплой (Vercel)

1. Загрузите репозиторий на GitHub.
2. В [Vercel](https://vercel.com) → **Add New Project** → импортируйте репозиторий.
3. В **Settings → Environment Variables** добавьте все переменные из `.env.example`
   (как минимум Supabase URL/Anon key). Vercel сам определит Next.js.
   ⚠️ **`NEXT_PUBLIC_APP_URL` = ваш production URL** (напр.
   `https://mvp-ai-email-generator.vercel.app`) — он используется как target
   для email-подтверждения Supabase.
4. **Deploy**. После первого деплоя пропишите тот же URL в Supabase Dashboard →
   Authentication → URL Configuration → **Site URL** и **Redirect URLs**
   (см. шаг 5 в установке выше).

Альтернативно — Netlify, Railway, Render: любой Node.js-хостинг с поддержкой Next.js.

---

## 📂 Структура репозитория

```
.
├── src/                 # Исходный код (DDD + Hexagonal)
├── supabase/            # SQL-схема и политики RLS
├── tests/               # Unit-тесты (vitest)
├── PLAN.md              # Архитектурный план (лексика домена, слои, этапы)
├── AI_DEVELOPMENT_REPORT.md   # Отчёт об AI-разработке ⭐
├── SMTP_GUIDE.md        # Гайд по кастомному SMTP (Gmail)
└── README.md
```

---

## License

MIT
