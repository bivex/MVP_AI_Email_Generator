# AI Email Generator

MVP application for generating professional emails using AI.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **UI**: Tailwind CSS v4 + shadcn/ui components
- **Auth**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI / Anthropic / Gemini (mock mode by default)
- **Animations**: Framer Motion

## Architecture

This project follows **Domain-Driven Design (DDD)** and **Hexagonal Architecture (Ports & Adapters)**:

```
src/
├── domain/                    # Pure domain logic (no framework dependencies)
│   ├── entities/             # User, EmailTemplate, GenerationRequest
│   ├── value-objects/        # EmailTone, EmailLength, SubjectLine, etc.
│   ├── events/               # Domain events
│   ├── repositories/         # Repository interfaces (ports)
│   ├── services/             # Domain services
│   └── errors/               # Domain errors
│
├── application/              # Use cases & application logic
│   ├── use-cases/            # RegisterUser, GenerateEmail, etc.
│   ├── dto/                  # Data Transfer Objects
│   └── interfaces/           # IAIProvider, IAuthService
│
├── infrastructure/           # External adapters & implementations
│   ├── adapters/
│   │   ├── auth/             # SupabaseAuthAdapter
│   │   ├── ai/               # OpenAIAdapter, MockAIAdapter
│   │   └── repositories/     # Supabase repositories
│   ├── config/               # Environment config
│   └── di/                   # Dependency Injection container
│
└── presentation/             # Next.js App Router (UI layer)
    ├── app/                  # Pages & layouts
    ├── components/           # React components
    │   ├── ui/               # shadcn/ui components
    │   ├── landing/          # Landing page sections
    │   ├── auth/             # Auth forms
    │   ├── dashboard/        # Dashboard components
    │   └── shared/           # Shared components (Navbar)
    ├── hooks/                # Custom React hooks
    └── lib/                  # Supabase client, utils
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mvp-ai-email-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials and AI provider API keys.

4. Set up Supabase database:
   - Go to your Supabase project
   - Open the SQL Editor
   - Run the SQL from `supabase/schema.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `OPENAI_API_KEY` | OpenAI API key (optional) |
| `ANTHROPIC_API_KEY` | Anthropic API key (optional) |
| `GOOGLE_AI_API_KEY` | Google AI API key (optional) |
| `AI_PROVIDER` | `mock`, `openai`, `anthropic`, or `gemini` |

## AI Provider

The application supports multiple AI providers. Set `AI_PROVIDER` in your `.env`:

- `mock` — Uses built-in templates (no API key needed)
- `openai` — Uses OpenAI GPT-4
- `anthropic` — Uses Anthropic Claude
- `gemini` — Uses Google Gemini

## Database Schema

Run `supabase/schema.sql` in your Supabase SQL Editor to create the required tables.

## Building for Production

```bash
npm run build
npm start
```

## License

MIT
