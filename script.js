const modulesDiv = document.getElementById("modules");
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const inputPrompt = document.getElementById("prompt");

const moduleNames = [
  "dala", "nzuri", "luminarius", "emilia", "zalaya", "sayu", "axekode"
];

function initModuleBars() {
  moduleNames.forEach(name => {
    const div = document.createElement("div");
    div.className = "module";
    div.innerHTML = `
      <span>${name.toUpperCase()}</span>
      <div class="bar" id="freq-${name}" style="width:50%"></div>
    `;
    modulesDiv.appendChild(div);
  });
}

initModuleBars();

function speakText(text) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  speechSynthesis.speak(utter);
}

function addMsg(msg, fromUser = false) {
  const div = document.createElement("div");
  div.textContent = (fromUser ? "Você: " : "CÓDEX: ") + msg;
  div.style.color = fromUser ? "white" : "#66fcf1";
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendPrompt() {
  const text = inputPrompt.value.trim();
  if (!text) return;

  addMsg(text, true);

  const res = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: text })
  });

  const data = await res.json();
  addMsg(data.response);
  speakText(data.response);

  for (const key in data.modulesState) {
    document.getElementById(`freq-${key}`).style.width = data.modulesState[key] + "%";
  }

  inputPrompt.value = "";
}

sendBtn.addEventListener("click", sendPrompt);
inputPrompt.addEventListener("keypress", e => {
  if (e.key === "Enter") sendPrompt();
});

// Canvas
const canvas = document.getElementById("logCanvas");
const ctx = canvas.getContext("2d");

let internalFreq = {};
moduleNames.forEach(n => internalFreq[n] = 50);

function animateFlow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  internalFreq = { ...internalFreq };

  const total = moduleNames.length;

  for (let i = 0; i < total; i++) {
    for (let j = i + 1; j < total; j++) {
      const x1 = (i + 1) * (canvas.width / (total + 1));
      const x2 = (j + 1) * (canvas.width / (total + 1));

      const y1 = canvas.height - (internalFreq[moduleNames[i]] / 100) * canvas.height;
      const y2 = canvas.height - (internalFreq[moduleNames[j]] / 100) * canvas.height;

      ctx.strokeStyle = "rgba(102,252,241,0.4)";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  requestAnimationFrame(animateFlow);
}

animateFlow();
