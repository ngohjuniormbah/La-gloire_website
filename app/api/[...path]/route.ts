import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { db, deleteRecord, getCollection, getSettings, insertRecord, updateRecord } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ path: string[] }> };
const EMPTY_SETTINGS = { churchName: 'La Gloire de Dieu', address: '', cityCountry: '', phone: '', prayerLine: '', email: '' };
const clip = (v: unknown, max = 300) => String(v ?? '').trim().slice(0, max);
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;
const today = () => new Date().toISOString().slice(0, 10);
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function sign(payload: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not configured');
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}
function validAdminToken(token: string) {
  const [expiry, signature] = token.split('.');
  if (!expiry || !signature || !process.env.SESSION_SECRET) return false;
  const expected = sign(expiry);
  const a = Buffer.from(signature); const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b) && Number(expiry) > Date.now();
}
function validAdmin(req: NextRequest) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  return validAdminToken(token);
}
function requireAdmin(req: NextRequest) {
  if (!validAdmin(req)) return json({ error: 'unauthorized' }, 401);
  return null;
}
function safeUrl(value: unknown) {
  const valueString = clip(value, 2000);
  if (valueString.startsWith('/uploads/')) return '';
  try { const u = new URL(valueString); return ['http:', 'https:'].includes(u.protocol) ? u.toString() : ''; }
  catch { return ''; }
}
function tokenForAdmin() {
  const payload = String(Date.now() + 12 * 60 * 60 * 1000);
  return `${payload}.${sign(payload)}`;
}

async function readBody(req: NextRequest) {
  try { return await req.json(); } catch { return {}; }
}

async function handle(req: NextRequest, ctx: Ctx) {
  const path = (await ctx.params).path;
  const route = path.join('/');
  const method = req.method.toUpperCase();

  // Temporary client-preview mode: no database writes or admin operations.
  if (process.env.PREVIEW_MODE === 'true') {
    if (route === 'health' && method === 'GET') {
      return json({ status: 'ok', mode: 'preview', database: 'disabled' });
    }

    if (route === 'public' && method === 'GET') {
      return json({
        settings: EMPTY_SETTINGS,
        campaigns: [],
        media: [],
        gallery: [],
        reviews: []
      });
    }

    if (['messages', 'donations', 'members', 'reviews'].includes(route)
        && method === 'POST') {
      return json({
        error: 'preview_mode',
        message: 'This feature will be enabled after the website review.'
      }, 503);
    }

    if (route.startsWith('admin/')) {
      return json({
        error: 'preview_mode',
        message: 'Administration will be enabled after database setup.'
      }, 503);
    }

    return json({ error: 'not_found' }, 404);
  }
  if (route !== 'admin/login' && !process.env.DATABASE_URL) return json({ error: 'server_not_configured', detail: 'DATABASE_URL is not configured.' }, 503);
  try {
    if (route === 'health' && method === 'GET') {
      await db.query('SELECT 1');
      return json({ status: 'ok', database: 'connected' });
    }

    if (route === 'public' && method === 'GET') {
      const [settings, campaigns, media, gallery, reviews] = await Promise.all([
        getSettings(), getCollection('campaigns'), getCollection('media'), getCollection('gallery'), getCollection('reviews')
      ]);
      return json({ settings: { ...EMPTY_SETTINGS, ...settings }, campaigns, media, gallery, reviews: reviews.filter((r) => r.approved) });
    }

    if (route === 'messages' && method === 'POST') {
      const b = await readBody(req); const name = clip(b.name, 120); const email = clip(b.email, 160); const message = clip(b.message, 4000);
      if (!name || !email || !message || !email.includes('@')) return json({ error: 'missing_fields' }, 400);
      const item = { id: uid('msg'), name, email, subject: clip(b.subject, 200), message, date: today(), status: 'new' };
      await insertRecord('messages', item); return json({ id: item.id }, 201);
    }

    if (route === 'donations' && method === 'POST') {
      const b = await readBody(req); const donorName = clip(b.donorName, 120); const email = clip(b.email, 160);
      if (!donorName || !email || !email.includes('@')) return json({ error: 'missing_fields' }, 400);
      const item = { id: uid('don'), donorName, email, phone: clip(b.phone, 40), city: clip(b.city, 80), country: clip(b.country, 80), campaignId: clip(b.campaignId, 60), campaignTitle: clip(b.campaignTitle, 240), message: clip(b.message, 2000), isAnonymous: Boolean(b.isAnonymous), date: today(), receiptNumber: `LGD-${new Date().getFullYear()}-${crypto.randomInt(1000, 10000)}`, status: 'pending_contact' };
      await insertRecord('donations', item); return json(item, 201);
    }

    if (route === 'members' && method === 'POST') {
      const b = await readBody(req); const fullName = clip(b.fullName, 120); const email = clip(b.email, 160);
      if (!fullName || !email || !email.includes('@')) return json({ error: 'missing_fields' }, 400);
      const item = { id: uid('mem'), fullName, email, phone: clip(b.phone, 40), membershipType: clip(b.membershipType, 40) || 'regular', city: clip(b.city, 80), country: clip(b.country, 80), joinedDate: today(), status: 'active', membershipNumber: `LGD-REG-${crypto.randomInt(100, 1000)}` };
      await insertRecord('members', item); return json(item, 201);
    }

    if (route === 'reviews' && method === 'POST') {
      const b = await readBody(req); const name = clip(b.name, 120); const comment = clip(b.comment, 2000);
      if (!name || !comment) return json({ error: 'missing_fields' }, 400);
      const item = { id: uid('rev'), name, roleOrCity: clip(b.roleOrCity, 120), rating: Math.min(5, Math.max(1, Math.round(Number(b.rating) || 5))), comment, date: today(), approved: false };
      await insertRecord('reviews', item); return json({ ok: true }, 201);
    }

    if (route === 'admin/login' && method === 'POST') {
      const b = await readBody(req); const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword || !process.env.SESSION_SECRET) return json({ error: 'admin_not_configured' }, 503);
      const given = Buffer.from(String(b.password || '')); const real = Buffer.from(adminPassword);
      const match = given.length === real.length && crypto.timingSafeEqual(given, real);
      if (!match) return json({ error: 'invalid_password' }, 401);
      return json({ token: tokenForAdmin() });
    }

    if (route === 'admin/upload' && method === 'POST') {
      if (!process.env.BLOB_READ_WRITE_TOKEN) return json({ error: 'blob_not_configured' }, 503);
      const body = await readBody(req) as HandleUploadBody;
      try {
        const result = await handleUpload({
          body,
          request: req,
          onBeforeGenerateToken: async (_pathname, clientPayload) => {
            let payload: { token?: string; kind?: string } = {};
            try { payload = JSON.parse(clientPayload || '{}'); } catch { throw new Error('invalid_upload_payload'); }
            if (!payload.token || !validAdminToken(payload.token)) throw new Error('unauthorized');
            const types = payload.kind === 'image' ? ['image/jpeg','image/png','image/webp','image/gif']
              : payload.kind === 'video' ? ['video/mp4','video/webm','video/quicktime']
              : payload.kind === 'pdf' ? ['application/pdf'] : [];
            if (!types.length) throw new Error('invalid_type');
            return { allowedContentTypes: types, addRandomSuffix: true, tokenPayload: JSON.stringify({ kind: payload.kind }) };
          },
          onUploadCompleted: async ({ blob }) => { console.info('[blob] uploaded', blob.pathname); }
        });
        return json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'upload_failed';
        return json({ error: message === 'unauthorized' ? 'unauthorized' : message }, message === 'unauthorized' ? 401 : 400);
      }
    }

    if (route.startsWith('admin/')) {
      const denied = requireAdmin(req); if (denied) return denied;
      if (route === 'admin/state' && method === 'GET') {
        const [settings, campaigns, media, gallery, reviews, donations, members, messages] = await Promise.all([
          getSettings(), getCollection('campaigns'), getCollection('media'), getCollection('gallery'), getCollection('reviews'), getCollection('donations'), getCollection('members'), getCollection('messages')
        ]);
        return json({ settings: { ...EMPTY_SETTINGS, ...settings }, campaigns, media, gallery, reviews, donations, members, messages });
      }
      if (route === 'admin/settings' && method === 'PUT') {
        const b = await readBody(req); const settings = { churchName: clip(b.churchName, 160) || 'La Gloire de Dieu', address: clip(b.address, 200), cityCountry: clip(b.cityCountry, 120), phone: clip(b.phone, 60), prayerLine: clip(b.prayerLine, 60), email: clip(b.email, 160) };
        await db.execute('INSERT INTO site_settings (id, settings_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE settings_json = VALUES(settings_json)', [JSON.stringify(settings)]);
        return json(settings);
      }

      const collectionCreate = route.match(/^admin\/(gallery|media|campaigns)$/);
      if (collectionCreate && method === 'POST') {
        const collection = collectionCreate[1]; const b = await readBody(req); let item: any = null;
        if (collection === 'gallery') {
          const src = safeUrl(b.src); if (clip(b.titleFr) && src) item = { id: uid('gal'), titleFr: clip(b.titleFr), titleEn: clip(b.titleEn) || clip(b.titleFr), descFr: clip(b.descFr, 600), descEn: clip(b.descEn, 600) || clip(b.descFr, 600), src, source: 'link', date: today() };
        } else if (collection === 'media') {
          const url = safeUrl(b.url); if (clip(b.titleFr) && url && ['video','pdf'].includes(b.type)) item = { id: uid('med'), type: b.type, titleFr: clip(b.titleFr), titleEn: clip(b.titleEn) || clip(b.titleFr), descriptionFr: clip(b.descriptionFr, 600), descriptionEn: clip(b.descriptionEn, 600) || clip(b.descriptionFr, 600), url, source: 'link', date: today() };
        } else if (clip(b.titleFr)) {
          item = { id: uid('camp'), titleFr: clip(b.titleFr), titleEn: clip(b.titleEn) || clip(b.titleFr), descriptionFr: clip(b.descriptionFr, 1200), descriptionEn: clip(b.descriptionEn, 1200) || clip(b.descriptionFr, 1200), category: 'humanitarian', targetAmount: Math.max(0, Number(b.targetAmount) || 0), currentAmount: Math.max(0, Number(b.currentAmount) || 0), donorsCount: 0, location: clip(b.location, 120), imageUrl: safeUrl(b.imageUrl) || undefined };
        }
        if (!item) return json({ error: 'invalid_item' }, 400);
        await insertRecord(collection, item); return json(item, 201);
      }

      const campaignPatch = route.match(/^admin\/campaigns\/([^/]+)$/);
      if (campaignPatch && method === 'PATCH') {
        const b = await readBody(req); const item = await updateRecord('campaigns', decodeURIComponent(campaignPatch[1]), (x) => ({ ...x, ...(b.currentAmount !== undefined ? { currentAmount: Math.max(0, Number(b.currentAmount) || 0) } : {}), ...(b.targetAmount !== undefined ? { targetAmount: Math.max(0, Number(b.targetAmount) || 0) } : {}) }));
        return item ? json(item) : json({ error: 'not_found' }, 404);
      }
      const statusPatch = route.match(/^admin\/(reviews|messages|donations)\/([^/]+)$/);
      if (statusPatch && method === 'PATCH') {
        const [, collection, id] = statusPatch; const b = await readBody(req);
        const item = await updateRecord(collection, decodeURIComponent(id), (x) => {
          if (collection === 'reviews' && typeof b.approved === 'boolean') return { ...x, approved: b.approved };
          if (collection === 'messages' && ['new','replied','archived'].includes(b.status)) return { ...x, status: b.status };
          if (collection === 'donations' && ['completed','processing','pending_contact'].includes(b.status)) return { ...x, status: b.status };
          return x;
        });
        return item ? json(item) : json({ error: 'not_found' }, 404);
      }
      const deletion = route.match(/^admin\/(gallery|media|campaigns|reviews|messages|donations|members)\/([^/]+)$/);
      if (deletion && method === 'DELETE') {
        const [, collection, id] = deletion; const ok = await deleteRecord(collection, decodeURIComponent(id));
        return ok ? json({ ok: true }) : json({ error: 'not_found' }, 404);
      }
    }
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    console.error('[api]', route, error);
    const message = error instanceof Error ? error.message : 'internal_error';
    if (message.includes('DATABASE_URL') || message.includes('SESSION_SECRET')) return json({ error: 'server_not_configured', detail: message }, 503);
    if (message.includes("doesn't exist") || message.includes('ER_NO_SUCH_TABLE')) return json({ error: 'database_schema_missing', detail: 'Run database-schema.sql in your MySQL database.' }, 503);
    return json({ error: 'internal_error' }, 500);
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
