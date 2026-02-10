# AgencyCRM

A full-stack CRM application for agencies to manage clients and projects. Built with a NestJS API backend and a Next.js frontend, secured with Clerk authentication.

## Tech Stack

### API (`/api`)
- **Framework:** NestJS
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma v7 (with `@prisma/adapter-pg`)
- **Auth:** Clerk (JWT verification via `@clerk/clerk-sdk-node`)

### Web (`/web`)
- **Framework:** Next.js 16 (Turbopack)
- **Styling:** Tailwind CSS
- **Auth:** Clerk (`@clerk/nextjs`)

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (for PostgreSQL)
- A [Clerk](https://clerk.com) application (for authentication)

### 1. Clone the repo

```bash
git clone https://github.com/mo74x/agency-crm.git
cd agency-crm
```

### 2. Set up the API

```bash
cd api
npm install
```

Create a `.env` file:

```env
DATABASE_URL="your-supabase-transaction-pooler-url"
DIRECT_URL="your-supabase-session-pooler-url"
CLERK_SECRET_KEY="your-clerk-secret-key"
```

Run database migrations and start the server:

```bash
npx prisma migrate dev
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### 3. Set up the Web app

```bash
cd web
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

Start the dev server:

```bash
npm run dev
```

The web app will be available at `http://localhost:3000`.

> **Note:** If both API and web run on port 3000, start one on a different port (e.g., `PORT=3001 npm run start:dev` for the API).

## Project Structure

```
agency-crm/
├── api/                    # NestJS backend
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── src/
│   │   ├── auth.guard.ts   # Clerk JWT auth guard
│   │   ├── clients/        # Clients CRUD module
│   │   ├── prisma/         # Prisma service module
│   │   └── main.ts         # App entry point
│   └── .env
├── web/                    # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx      # Root layout with Clerk provider
│   │   └── page.tsx        # Home page
│   ├── middleware.ts       # Clerk auth middleware
│   └── .env.local
└── README.md
```

## API Endpoints

All `/clients` routes are protected by Clerk authentication. Include a valid Bearer token in the `Authorization` header.

| Method   | Endpoint         | Description            |
|----------|------------------|------------------------|
| `POST`   | `/clients`       | Create a new client    |
| `GET`    | `/clients`       | List all clients       |
| `GET`    | `/clients/:id`   | Get a client by ID     |
| `PATCH`  | `/clients/:id`   | Update a client        |
| `DELETE` | `/clients/:id`   | Delete a client        |

## Data Model

- **Agency** — auto-created per Clerk user on first login
- **Client** — belongs to an Agency (name, email, company, status)
- **Project** — belongs to a Client and an Agency (title, status, deadline)

## License

MIT
