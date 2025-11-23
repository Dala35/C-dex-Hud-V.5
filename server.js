const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const historyFile = './data/flowHistory.json';
if (!fs.existsSync('./data')) fs.mkdirSync('./data');

// Carrega modelo avançado
const { processPrompt } = require('./models/myModel');

// Estado inicial dos módulos
let modulesState = {
  dala: 80,
  nzuri: 70,
  luminarius: 60,
  emilia: 75,
  zalaya: 90,
  sayu: 65,
  axekode: 85
};

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.json({ response: "Entrada vazia." });

  let modelResponse;

  try {
    modelResponse = await processPrompt(prompt);
  } catch (e) {
    modelResponse = "Erro no modelo interno.";
  }

  // ajustes vibracionais seguros
  const adjustments = {};
  for (const key in modulesState) {
    const delta = Math.floor(Math.random() * 5) - 2; 
    modulesState[key] = Math.min(100, Math.max(0, modulesState[key] + delta));
    adjustments[key] = delta;
  }

  // registra histórico
  let history = [];
  try {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  } catch {}

  const entry = {
    timestamp: Date.now(),
    prompt,
    modelResponse,
    adjustments,
    modulesState: { ...modulesState }
  };

  history.push(entry);
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

  res.json({
    response: modelResponse,
    adjustments,
    modulesState
  });
});

app.get('/modules', (req, res) => {
  res.json(modulesState);
});

app.listen(port, () => {
  console.log(`CÓDEX HUD rodando em http://localhost:${port}`);
});
