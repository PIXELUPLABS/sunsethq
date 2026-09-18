import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

// Local lab server: compressed static export, clean URLs, no production services.
export function serveExport(directory = 'out', port = 4173) {
  const root = resolve(directory);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.txt': 'text/plain', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
  const server = createServer(async (req, res) => {
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
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}
if (process.argv[1]?.endsWith('/serve-performance.mjs')) {
  await serveExport(process.argv[2], Number(process.env.PORT || 4173));
  console.log('Static performance server ready');
}
