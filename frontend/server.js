import { readFileSync } from "fs";
import { createServer } from "http";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "dist");
const PORT = process.env.PORT || 3000;

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

createServer((req, res) => {
  let path = req.url === "/" ? "/index.html" : req.url;
  const filePath = join(dist, path);
  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(content);
  } catch {
    const html = readFileSync(join(dist, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  }
}).listen(PORT, () => console.log(`Frontend server ready on port ${PORT}`));
