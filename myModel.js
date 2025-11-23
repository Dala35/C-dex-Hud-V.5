const fs = require('fs');
const path = require('path');

const historyFile = path.join(__dirname, '../data/flowHistory.json');

async function runLocalModel(prompt, context) {
  // Aqui você integra seu modelo real
  // Pode ser TensorFlow, PyTorch, API local, etc.

  return `Processado pelo seu modelo avançado: "${prompt}" | contexto: ${context.join(" | ")}`;
}

async function processPrompt(prompt) {
  let history = [];
  try {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  } catch {}

  const lastContext = history.slice(-5).map(h => h.prompt);

  const response = await runLocalModel(prompt, lastContext);

  return response;
}

module.exports = { processPrompt };
