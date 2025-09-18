# Ankur_ai_assignment

# Event Booking App (Next.js + Prisma)
Production-ready event discovery and booking app with authentication, a user dashboard, and a SQLite database (Prisma). Ships with migrations and seed data so anyone can run it locally without extra setup.
Live demo credentials and full local setup steps are below.
---
## Quick Start
Prerequisites: Node.js 18+ (LTS recommended), npm
```bash
# 1) Install dependencies (runs `prisma generate` on postinstall)
npm install
# 2) Set env (a ready .env is in the repo; if creating manually, see below)
# 3) Apply migrations and seed sample data
npx prisma migrate deploy
npm run db:seed
# 4) Start the app
npm run dev
# open http://localhost:3000
```
Demo admin login for testing:
- Email: admin@example.com
- Password: admin123
---
## Technologies Used
- Next.js 15 (App Router) + React 19
- Authentication: next-auth (Credentials provider, JWT sessions)
- Database: Prisma ORM + SQLite
- Styling: Tailwind CSS
- Utility: bcrypt (password hashing)
---
## Features Implemented
- Browse events with price, venue, seats, and details
- Event details page with quantity selection and booking
- Auth (signup/signin) with hashed passwords
- User dashboard with bookings, total tickets, total cost
- Booking cancellation (seats are returned to the event)
- Transactional booking (prevents overselling; checks and decrements seats atomically)
- Seeded admin user and sample events
- Admin-only tool to bulk update prices: `POST /api/tools/update-prices`
---
## Pages & Routes (How It Works)
- `/` Home: Landing page. If logged in, redirects to `/dashboard`.
- `/events` Events list: Browse all events; book directly and open details.
- `/events/[id]` Event detail: See full info, pick quantity, and book.
- `/auth/signin` Sign in: Email + password (NextAuth credentials).
- `/auth/signup` Sign up: Create a user account.
- `/dashboard` Dashboard: View bookings, totals, cancel bookings, navigate to event details.
Pages count: 5 primary UI pages plus the dynamic event page and auth pages (Home, Events, Event Detail, Dashboard, Sign In, Sign Up).
Data flow overview:
- UI pages fetch from the app’s API routes under `/api/*`.
- Auth state is provided via `next-auth` (JWT strategy) and enforced in API routes where required.
- Booking uses a single transaction to decrement seats and upsert a user’s booking per event.
- Cancelling a booking deletes it and increments back the event’s seats.
---
## Database, Migrations, Seed Data
- DB: SQLite file at `prisma/dev.db`
- Prisma schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/*` (includes user/event/booking tables and booking.quantity column)
- Seed script: `prisma/seed.cjs` (wired via `npm run db:seed`)
Schema (simplified):
- `User(id, name, email [unique], password, role [USER|ADMIN], createdAt)`
- `Event(id, title, description?, date, venue, price, seats, createdAt)`
- `Booking(id, userId, eventId, quantity, createdAt)` with unique `(userId, eventId)`
Seeded data includes:
- Admin user: `admin@example.com` / `admin123`
- Events: Launch Party + multiple realistic sample events (Tech Conference, Music Fest, etc.)
---
## Local Setup (From GitHub Clone)
1) Clone and install
```bash
git clone <your-repo-url>
cd <cloned-folder>
npm install
```
2) Environment variables
Create `.env` in the project root (already present in this repo). Example:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-random-string
```
If you keep the provided `.env`, everything works out of the box.
3) Database
```bash
# Apply all committed migrations to prisma/dev.db
npx prisma migrate deploy
# Seed demo data (admin user + events)
npm run db:seed
# Optional: inspect data in a GUI
npx prisma studio
```
4) Run the app
```bash
npm run dev
# http://localhost:3000
```
---
## API Endpoints
- `GET /api/events` → list events (price enforced with a minimum of 500)
- `GET /api/events/:id` → event by id
- `GET /api/bookings` → current user bookings (requires auth)
- `POST /api/bookings` → create/increment booking `{ eventId, quantity }` (auth required)
- `DELETE /api/bookings/:id` → cancel booking (auth required)
- `POST /api/auth/signup` → create account
- `POST /api/tools/update-prices` → admin-only bulk price update `{ from, to }`
Auth endpoints under `next-auth` are provided by `app/api/auth/[...nextauth]/route.js`.
---
## Approach & Assumptions
- Simplicity first: SQLite for zero-config local development; Prisma for type-safe data access.
- Credentials auth with hashed passwords via `bcrypt`; JWT session strategy in NextAuth.
- Preventing oversell: bookings are inside a single transaction that checks seats and decrements atomically.
- One booking row per user/event: enforced by a unique composite index; quantity increments on repeat bookings.
- Price floor: API ensures event `price >= 500` to keep consistent pricing in UI.
- Admin tool exists as a protected API endpoint for bulk price adjustment.
---
## Troubleshooting
- sqlite3 install errors on Linux/macOS: ensure build tools are available (Python, make, C/C++ toolchain). Re-run `npm install`.
- Prisma client not found: run `npx prisma generate` or reinstall deps.
- Seed issues: run `npx prisma migrate reset --force` then `npm run db:seed`.
---
## Available Scripts
- `npm run dev` → start dev server
- `npm run build` → production build
- `npm run start` → start production server
- `npm run db:reset` → reset database (destroys data) and re-apply migrations
- `npm run db:seed` → seed demo data
---
## License
This assignment/project is provided as-is for demonstration and evaluation.






