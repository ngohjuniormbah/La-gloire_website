# La Gloire de Dieu — Next.js + TypeScript + Tailwind + MySQL

The original French/English website interface has been moved from Vite/Express to Next.js App Router. The current UI includes Home, Who We Are, Follow Us (videos/books/live teachings), Donate, Membership, Contact, member portal, and admin dashboard.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS v4
- Managed MySQL-compatible database through `mysql2`
- Vercel Blob for admin-uploaded media (optional but required for the upload button)
- Vercel deployment from GitHub

## Before running/deploying

1. Create a managed MySQL database that accepts TLS connections from Vercel.
2. Run `database-schema.sql` in that database (the file is in the project root).
3. Copy `.env.example` to `.env.local` for local development and set:
   - `DATABASE_URL` — provider's MySQL URL, including `?ssl=true` when required by the provider.
   - `ADMIN_PASSWORD` — a strong admin password.
   - `SESSION_SECRET` — a long random secret (`openssl rand -hex 32`).
   - `BLOB_READ_WRITE_TOKEN` — Vercel Blob read/write token, required for uploads.
4. Run `npm install`, then `npm run dev`.
5. Run `npm run lint` and `npm run build` before deployment.
6. Push the repository to GitHub, import it into Vercel, and add the same environment variables in Vercel Project Settings → Environment Variables. Redeploy after changing variables.

## API endpoints

- `GET /api/health` — database connectivity check
- `GET /api/public` — published public content
- `POST /api/messages`, `/api/donations`, `/api/members`, `/api/reviews`
- `POST /api/admin/login`
- `GET /api/admin/state`, `PUT /api/admin/settings`
- `POST /api/admin/gallery`, `/api/admin/media`, `/api/admin/campaigns`
- `PATCH /api/admin/campaigns/:id`, `/api/admin/reviews/:id`, `/api/admin/messages/:id`, `/api/admin/donations/:id`
- `DELETE /api/admin/:collection/:id`
- `POST /api/admin/upload?kind=image|video|pdf` (Vercel Blob)

## Notes and limitations

- MySQL stores structured website records and settings. Media binaries are stored in Vercel Blob rather than database rows.
- Uploaded files require a Vercel Blob token; if it is not configured, the API reports `blob_not_configured` rather than pretending the upload succeeded.
- This project cannot be considered production-verified until a real MySQL database and Blob token are configured and end-to-end tests are run against that deployment.
- Use a MySQL-compatible provider that supports external TLS connections and connection limits suitable for serverless workloads. The app keeps its pool small (3 connections per warm function instance) to reduce connection pressure.
- This project does not process card payments. The donation form records a donation enquiry; connect a legitimate payment provider if online payments are required.
