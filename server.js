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
app.use(express.json({ limit: '50mb' }));

const dbPath = path.resolve(__dirname, 'store.json');

// Helper para ler o arquivo JSON
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

// Helper para escrever no arquivo JSON
function saveStore(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Erro ao salvar store.json', e);
  }
}

// Rota de leitura (Recupera tudo da tabela para carregar no front-end)
app.get('/api/store/:key', (req, res) => {
  const store = getStore();
  const value = store[req.params.key] || null;
  res.json({ value });
});

// Rota de salvamento (Persiste o estado que vem do front-end)
app.post('/api/store/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  const store = getStore();
  
  store[key] = value;
  saveStore(store);
  
  res.json({ success: true, changes: 1 });
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
