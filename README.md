# AgencyCRM

A full-stack CRM built for agencies to manage clients, projects, and generate PDF reports. Features Clerk authentication, a NestJS REST API, and a Next.js frontend.

---

## Tech Stack

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| **Frontend**   | Next.js 16, React 19, Tailwind CSS 4               |
| **Backend**    | NestJS 11, TypeScript                               |
| **Database**   | PostgreSQL (Supabase-hosted), Prisma ORM 7          |
| **Auth**       | Clerk (`@clerk/nextjs` + `@clerk/clerk-sdk-node`)   |
| **PDF**        | `@react-pdf/renderer` for client-side PDF generation |
| **Validation** | `class-validator` + `class-transformer`              |

---

## Project Structure

```
agency-crm/
├── api/                        # NestJS Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Prisma migrations
│   └── src/
│       ├── main.ts             # App entry point (port 3001)
│       ├── app.module.ts       # Root module
│       ├── auth.guard.ts       # Clerk JWT verification guard
│       ├── current-user.decorator.ts  # @CurrentUser() decorator
│       ├── prisma/             # PrismaService (DB connection)
│       ├── clients/            # Clients module (full CRUD)
│       ├── projects/           # Projects module (create, list)
│       └── reports/            # Reports module (create, list, get)
│
└── web/                        # Next.js Frontend
    ├── lib/
    │   └── api.ts              # useApi() hook (auto-attaches Clerk token)
    └── app/
        ├── layout.tsx          # Root layout with ClerkProvider
        ├── page.tsx            # Home page
        ├── clients/page.tsx    # Clients management page
        ├── projects/page.tsx   # Projects management page
        ├── reports/page.tsx    # Reports page with PDF download
        └── components/
            └── ReportDocument.tsx  # React-PDF report template
```

---

## Database Schema

```
Agency (1) ──── (*) Client (1) ──── (*) Project (1) ──── (*) Report
```

| Model       | Key Fields                                                             |
| ----------- | ---------------------------------------------------------------------- |
| **Agency**  | `id`, `name`, `authId` (Clerk user ID, unique)                         |
| **Client**  | `id`, `name`, `email?`, `company?`, `status` (ACTIVE/ARCHIVED)         |
| **Project** | `id`, `title`, `status` (PLANNING/IN_PROGRESS/REVIEW/DONE), `deadline?`|
| **Report**  | `id`, `title`, `month`, `content` (JSON — stores KPI metrics)          |

All resources are scoped to the authenticated Agency via `agencyId` relations.

---

## Environment Variables

### API (`api/.env`)

```env
# Clerk
CLERK_SECRET_KEY=sk_test_...

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://...?pgbouncer=true      # Pooled connection (for Prisma Migrate)
DIRECT_URL=postgresql://...                        # Direct connection (for PrismaClient)

# Server
PORT=3001
```

### Frontend (`web/.env.local`)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Clerk](https://clerk.com) account (API keys)
- A PostgreSQL database (e.g., [Supabase](https://supabase.com))

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd agency-crm

# Install API dependencies
cd api
npm install

# Install Frontend dependencies
cd ../web
npm install
```

### 2. Configure Environment

Create `api/.env` and `web/.env.local` with the variables listed above.

### 3. Set Up Database

```bash
cd api

# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### 4. Run the App

Open two terminals:

```bash
# Terminal 1 — API (runs on port 3001)
cd api
npm run start:dev

# Terminal 2 — Frontend (runs on port 3000)
cd web
npm run dev
```

Visit **http://localhost:3000** — sign in with Clerk, and you're ready to go.

---

## API Endpoints

All endpoints require a `Authorization: Bearer <clerk_token>` header.

### Clients

| Method   | Endpoint        | Description           |
| -------- | --------------- | --------------------- |
| `POST`   | `/clients`      | Create a new client   |
| `GET`    | `/clients`      | List all clients      |
| `GET`    | `/clients/:id`  | Get a single client   |
| `PATCH`  | `/clients/:id`  | Update a client       |
| `DELETE` | `/clients/:id`  | Delete a client       |

**Create Client Body:**
```json
{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "company": "Acme"
}
```

### Projects

| Method | Endpoint    | Description            |
| ------ | ----------- | ---------------------- |
| `POST` | `/projects` | Create a new project   |
| `GET`  | `/projects` | List all projects      |

**Create Project Body:**
```json
{
  "title": "Website Redesign",
  "clientId": "<client-uuid>"
}
```

### Reports

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| `POST` | `/reports`     | Create a new report   |
| `GET`  | `/reports`     | List all reports      |
| `GET`  | `/reports/:id` | Get a single report   |

**Create Report Body:**
```json
{
  "title": "February SEO Report",
  "month": "2026-02",
  "projectId": "<project-uuid>",
  "content": {
    "visits": 12500,
    "leads": 340,
    "conversion": 2.7
  }
}
```

---

## Features

- **Clerk Authentication** — Sign in/up via Clerk, JWT-protected API
- **Multi-tenant** — Each agency only sees their own clients, projects, and reports
- **Client Management** — Full CRUD with status tracking (Active/Archived)
- **Project Tracking** — Linked to clients with status workflow (Planning → In Progress → Review → Done)
- **Report Builder** — Create KPI reports with JSON content, linked to projects
- **PDF Generation** — Download professionally formatted PDF reports in the browser using `@react-pdf/renderer`

---

## Scripts

### API (`api/`)

| Script              | Command                  |
| ------------------- | ------------------------ |
| Dev server          | `npm run start:dev`      |
| Production build    | `npm run build`          |
| Production start    | `npm run start:prod`     |
| Lint                | `npm run lint`           |
| Tests               | `npm run test`           |
| Format              | `npm run format`         |

### Frontend (`web/`)

| Script           | Command           |
| ---------------- | ----------------- |
| Dev server       | `npm run dev`     |
| Production build | `npm run build`   |
| Production start | `npm run start`   |
| Lint             | `npm run lint`    |

---

## License

UNLICENSED — Private project.
