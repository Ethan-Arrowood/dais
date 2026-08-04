// Zero-dependency static file server for previewing Dais decks.
// Dual-stack (IPv4 + IPv6) so `localhost` resolves either way.
//   node serve.mjs [port]
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(import.meta.dirname);
const port = Number(process.argv[2]) || 4321;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let path = join(root, normalize(decodeURIComponent(url.pathname)));

  // Never serve outside the repo.
  if (!path.startsWith(root)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  try {
    let info = await stat(path);
    if (info.isDirectory()) {
      path = join(path, "index.html");
      info = await stat(path);
    }
    res.writeHead(200, {
      "Content-Type": TYPES[extname(path).toLowerCase()] ?? "application/octet-stream",
      "Content-Length": info.size,
      "Cache-Control": "no-store",
    });
    createReadStream(path).pipe(res);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
}).listen(port, () => {
  console.log(`Dais dev server → http://localhost:${port}`);
});
