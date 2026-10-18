# Vercel Deployment Checklist

## 1. Provision MySQL

Use a managed MySQL provider that allows secure external connections. Create a database and user with access only to that database. Run `database-schema.sql` in the provider's SQL console.

## 2. Configure the application

Set the following variables in Vercel → Project → Settings → Environment Variables (Production, Preview, Development as appropriate):

- `DATABASE_URL`: MySQL connection URL. Include the provider's required TLS settings.
- `ADMIN_PASSWORD`: strong unique administrator password.
- `SESSION_SECRET`: random secret generated with `openssl rand -hex 32`.
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob read/write token for uploads.

Never commit `.env.local` or actual secrets to GitHub.

## 3. Deploy

Push this folder to a GitHub repository, import that repository in Vercel, keep the default Next.js build settings, add the variables, and deploy.

## 4. Smoke-test the deployed app

- Open the home page and every navigation item.
- Open `/api/health`; expect `{"status":"ok","database":"connected"}`.
- Open `/api/public`; expect settings and empty content arrays on a fresh database.
- Submit a test contact message, donation enquiry, and membership form.
- Sign into the admin area with `ADMIN_PASSWORD`; verify records appear in the inbox.
- Test settings save, a gallery/media/campaign creation, status changes, deletion, and a Blob upload.
- Redeploy and verify that data still exists. MySQL and Blob provide persistence; the Vercel function filesystem is not used for persistent data.

A successful build alone does not prove database connectivity. Complete this checklist against the actual configured deployment before using the site for real member information.
