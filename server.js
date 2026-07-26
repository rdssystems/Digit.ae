import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: ['tauri://localhost', 'http://tauri.localhost', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ─── Rate Limiting (simples em memória) ────────────────────────────
const rateLimitMap = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 100;

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return next();
  }

  const entry = rateLimitMap.get(ip);
  if (now - entry.start > RATE_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return next();
  }

  entry.count++;
  if (entry.count > RATE_MAX) {
    return res.status(429).json({ error: 'Muitas requisições. Tente novamente em instantes.' });
  }
  next();
}

app.use('/api', rateLimiter);

// ─── Payload limit reduzido ────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ─── Validação de token PocketBase ─────────────────────────────────
const tokenCache = new Map();
const TOKEN_CACHE_TTL = 5 * 60_000;

async function validateToken(token) {
  if (tokenCache.has(token)) {
    const cached = tokenCache.get(token);
    if (Date.now() - cached.ts < TOKEN_CACHE_TTL) {
      return cached.valid;
    }
    tokenCache.delete(token);
  }

  try {
    const resp = await fetch('http://127.0.0.1:8090/api/collections/users/auth-refresh', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const valid = resp.ok;
    tokenCache.set(token, { valid, ts: Date.now() });
    return valid;
  } catch {
    // Se PocketBase não estiver disponível (modo offline), permite a requisição
    return true;
  }
}

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação ausente.' });
  }
  const token = authHeader.split(' ')[1];
  const isValid = await validateToken(token);
  if (!isValid) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
  next();
}

// ─── Store JSON ────────────────────────────────────────────────────
const dbPath = path.resolve(__dirname, 'store.json');

function getStore() {
  try {
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch (e) {
    console.error('Erro ao ler store.json', e);
  }
  return {};
}

function saveStore(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Erro ao salvar store.json', e);
  }
}

app.get('/api/store/:key', authMiddleware, (req, res) => {
  const store = getStore();
  const value = store[req.params.key] || null;
  res.json({ value });
});

app.post('/api/store/:key', authMiddleware, (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  const store = getStore();
  store[key] = value;
  saveStore(store);
  res.json({ success: true, changes: 1 });
});

// ─── Produção (build do Vite) ──────────────────────────────────────
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*all', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
