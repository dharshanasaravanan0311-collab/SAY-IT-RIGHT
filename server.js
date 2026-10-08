/**
 * Say It Right - High-Stakes Communication Coach
 * Node.js Express server & API handler.
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { SCENARIOS, getScenarioById } from './data/scenarios.js';
import { analyzeCommunication, extractGeminiApiKey } from './services/coachEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';
const STATIC_DIR = path.join(__dirname, 'static');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Disable caching for dynamic API
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  const hasGemini = Boolean(extractGeminiApiKey());
  res.json({
    status: 'healthy',
    app: 'Say It Right',
    gemini_configured: hasGemini,
    scenarios_available: SCENARIOS.length
  });
});

app.get('/api/scenarios', (req, res) => {
  res.json({
    scenarios: SCENARIOS
  });
});

app.get('/api/scenarios/:id', (req, res) => {
  const item = getScenarioById(req.params.id);
  if (item) {
    return res.json(item);
  }
  return res.status(404).json({ error: 'Scenario not found' });
});

app.post('/api/analyze', async (req, res) => {
  const { raw_draft, context = {}, api_key } = req.body || {};

  if (!raw_draft || typeof raw_draft !== 'string' || !raw_draft.trim()) {
    return res.status(400).json({ error: 'raw_draft is required' });
  }

  try {
    const result = await analyzeCommunication(raw_draft.trim(), context, api_key);
    return res.json(result);
  } catch (err) {
    console.error('Analysis error:', err);
    return res.status(500).json({ error: `Analysis failed: ${err.message}` });
  }
});

// Static files
app.use(express.static(STATIC_DIR));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`================================================================`);
  console.log(`  Say It Right: High-Stakes Communication Coach`);
  console.log(`  Server running at: http://${HOST}:${PORT}`);
  console.log(`================================================================`);
});
