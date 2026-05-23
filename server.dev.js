// Local dev server — mirrors Vercel's routing
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import infoHandler from "./api/info.js";
import sourcesHandler from "./api/sources.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".json": "application/json",
};

const API_ROUTES = {
  "/api/info":    infoHandler,
  "/api/sources": sourcesHandler,
};

async function runApi(handler, req, res) {
  const url = new URL(req.url, `http://localhost`);
  const query = Object.fromEntries(url.searchParams.entries());
  let statusCode = 200;
  const respHeaders = { "Access-Control-Allow-Origin": "*" };

  const fakeRes = {
    setHeader: (k, v) => { respHeaders[k] = v; },
    status(s) { statusCode = s; return this; },
    json(data) {
      res.writeHead(statusCode, { "Content-Type": "application/json", ...respHeaders });
      res.end(JSON.stringify(data));
    },
    end() { res.writeHead(statusCode, respHeaders); res.end(); },
  };

  await handler({ method: req.method, query, headers: req.headers, url: req.url }, fakeRes);
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const url = new URL(req.url, `http://localhost`);
  let pathname = url.pathname.replace(/\/$/, "") || "/";

  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

  // API routes
  const apiHandler = API_ROUTES[pathname];
  if (apiHandler) return await runApi(apiHandler, req, res);

  // Page routes
  if (pathname === "/") pathname = "/public/index.html";
  if (pathname === "/player") pathname = "/public/player.html";

  const filePath = path.join(__dirname, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    return res.end(fs.readFileSync(filePath));
  }

  res.writeHead(404); res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\nMovixy Player — http://localhost:${PORT}`);
  console.log(`Movie:   http://localhost:${PORT}/player?tmdb=550&type=movie&title=Fight+Club`);
  console.log(`TV show: http://localhost:${PORT}/player?tmdb=1396&type=tv&s=1&e=1&title=Breaking+Bad`);
  console.log(`API:     http://localhost:${PORT}/api/sources?tmdb=550&type=movie\n`);
});
