import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { content } from './content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'client', 'dist');
const messagesFile = path.join(__dirname, 'messages.json');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.get('/api/content', (_req, res) => res.json(content));

// Naive per-IP rate limit: 5 messages / 10 min.
const hits = new Map();
app.post('/api/contact', (req, res) => {
  const now = Date.now();
  const recent = (hits.get(req.ip) || []).filter((t) => now - t < 600_000);
  if (recent.length >= 5) return res.status(429).json({ error: 'Too many messages, try later.' });
  hits.set(req.ip, [...recent, now]);

  const { name, email, topic, message } = req.body || {};
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !message?.trim()) {
    return res.status(400).json({ error: 'Name, valid email and message are required.' });
  }
  const entry = {
    name: String(name).slice(0, 100),
    email: String(email).slice(0, 200),
    topic: String(topic || '').slice(0, 50),
    message: String(message).slice(0, 2000),
    at: new Date().toISOString(),
  };
  let all = [];
  try { all = JSON.parse(fs.readFileSync(messagesFile, 'utf8')); } catch {}
  all.push(entry);
  fs.writeFileSync(messagesFile, JSON.stringify(all, null, 2));
  res.json({ ok: true });
});

if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
