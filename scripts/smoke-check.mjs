import { readFile, access, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFile(path.join(root, p), 'utf8');
const checks = [];
async function check(name, fn) {
  try { await fn(); checks.push({ name, ok: true }); }
  catch (e) { checks.push({ name, ok: false, error: e.message }); }
}
await check('Next.js App Router entry points exist', async () => {
  for (const file of ['app/page.tsx','app/[...slug]/page.tsx','app/layout.tsx','app/globals.css']) await access(path.join(root,file));
});
await check('All original public views were retained', async () => {
  for (const file of ['HomeView.tsx','WhoWeAreView.tsx','FollowUsView.tsx','DonateView.tsx','MembershipView.tsx','ContactView.tsx','LoginView.tsx','AdminView.tsx']) await access(path.join(root,'src/views',file));
});
await check('New logo is present and used in navigation/footer', async () => {
  const image = await stat(path.join(root,'public/la-gloire-de-dieu-logo.webp'));
  assert.ok(image.size > 20_000 && image.size < 1_000_000, `Unexpected logo size: ${image.size}`);
  assert.match(await read('src/components/Navbar.tsx'), /la-gloire-de-dieu-logo\.webp/);
  assert.match(await read('src/components/Footer.tsx'), /la-gloire-de-dieu-logo\.webp/);
});
await check('MySQL schema and connector are included', async () => {
  assert.match(await read('database-schema.sql'), /CREATE TABLE IF NOT EXISTS site_records/);
  assert.match(await read('lib/db.ts'), /mysql\.createPool/);
  assert.match(await read('lib/db.ts'), /connectionLimit: 3/);
});
await check('Frontend API operations have matching server route logic', async () => {
  const client = await read('src/api.ts');
  const server = await read('app/api/[...path]/route.ts');
  for (const route of ['/api/public','/api/messages','/api/donations','/api/members','/api/reviews','/api/admin/login','/api/admin/state','/api/admin/settings']) {
    assert.ok(client.includes(route), `Frontend is missing ${route}`);
    assert.ok(server.includes(route.replace('/api/','')) || (route === '/api/admin/state' && server.includes('admin/state')), `Server is missing route logic for ${route}`);
  }
  assert.match(server, /handleUpload/);
  assert.match(client, /uploadBlob/);
});
await check('Legacy Express/Vite server was removed from the deployment', async () => {
  const pkg = JSON.parse(await read('package.json'));
  assert.ok(pkg.dependencies.next);
  assert.ok(!pkg.dependencies.express && !pkg.dependencies.vite);
  for (const stale of ['server.ts','vite.config.ts','index.html']) {
    try { await access(path.join(root, stale)); throw new Error(`${stale} should not remain`); } catch (error) { if (error.message.includes('should not remain')) throw error; }
  }
});
await check('Vercel deployment config and environment template exist', async () => {
  const pkg = JSON.parse(await read('package.json'));
  assert.ok(pkg.dependencies.next && pkg.dependencies.mysql2 && pkg.dependencies['@vercel/blob']);
  assert.ok(pkg.scripts.build && pkg.scripts.lint);
  for (const key of ['DATABASE_URL=','ADMIN_PASSWORD=','SESSION_SECRET=','BLOB_READ_WRITE_TOKEN=']) assert.ok((await read('.env.example')).includes(key));
});

for (const item of checks) console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.name}${item.error ? ` — ${item.error}` : ''}`);
console.log(`\n${checks.filter(x=>x.ok).length}/${checks.length} static smoke checks passed.`);
if (checks.some(x=>!x.ok)) process.exitCode = 1;
