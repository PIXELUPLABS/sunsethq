import { createServer } from 'node:http';
import { createSecureServer } from 'node:http2';
import { execFileSync } from 'node:child_process';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

// Local lab server: compressed static export, clean URLs, no production services.
export async function serveExport(directory = 'out', port = 4173, { http2 = false } = {}) {
  const root = resolve(directory);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.txt': 'text/plain', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
  const handler = async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let file = resolve(root, `.${pathname}`);
      if (!file.startsWith(root + sep) && file !== root) throw new Error('Invalid path');
      if (pathname === '/') file = resolve(root, 'index.html');
      else if (!extname(file)) file += '.html';
      let body = await readFile(file);
      res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
      res.setHeader('Cache-Control', pathname.startsWith('/_next/') ? 'public, max-age=31536000, immutable' : 'no-cache');
      if (/\.(html|js|css|svg|txt|json)$/.test(file) && req.headers['accept-encoding']?.includes('gzip')) {
        body = gzipSync(body); res.setHeader('Content-Encoding', 'gzip');
      }
      res.setHeader('Content-Length', body.length);
      res.end(body);
    } catch { res.writeHead(404); res.end('Not found'); }
  };
  let server;
  if (http2) {
    const tls = resolve('artifacts/performance/tls');
    await mkdir(tls, { recursive: true });
    const key = resolve(tls, 'localhost-key.pem'), cert = resolve(tls, 'localhost-cert.pem');
    try { await readFile(cert); await readFile(key); }
    catch {
      execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', cert,
        '-subj', '/CN=localhost', '-addext', 'subjectAltName=IP:127.0.0.1,DNS:localhost', '-days', '2'], { stdio: 'ignore' });
    }
    server = createSecureServer({ key: await readFile(key), cert: await readFile(cert), allowHTTP1: true }, handler);
  } else server = createServer(handler);
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await serveExport(process.argv[2], Number(process.env.PORT || 4173));
  console.log('Static performance server ready');
}
