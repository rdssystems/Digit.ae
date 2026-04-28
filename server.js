import express from 'express';
import cors from 'cors';
import sqlite3Pkg from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3Pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: ['tauri://localhost', 'http://tauri.localhost', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Arquivo do SQLite local na mesma pasta do servidor
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Erro ao conectar no banco:", err.message);
  else console.log('Conectado ao banco de dados SQLite local.');
});

// Tabela simples chave-valor para guardar o estado dinâmico (compatível com Zustand Persist)
db.run(`CREATE TABLE IF NOT EXISTS store (
  key TEXT PRIMARY KEY,
  value TEXT
)`);

// Rota de leitura (Recupera tudo da tabela para carregar no front-end)
app.get('/api/store/:key', (req, res) => {
  db.get('SELECT value FROM store WHERE key = ?', [req.params.key], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ value: row ? row.value : null });
  });
});

// Rota de salvamento (Persiste o estado que vem do front-end)
app.post('/api/store/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  
  db.run(`INSERT INTO store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`, [key, value], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, changes: this.changes });
  });
});

// (Produção VPS) Se houver o build do vite na pasta 'dist', serve a aplicação completa
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*all', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend e Banco de Dados rodando na porta ${PORT}`);
});
