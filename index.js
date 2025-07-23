  GNU nano 8.5                    index.js
// index.js
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://ixiz.my.id',
    'X-Title': 'IxizAI',
  },
  fetch: (url, options) => fetch(url, { ...options, compress: false }) >
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <title>IxizAI Chat</title>
      <style>
        body { font-family: sans-serif; background: #111; color: white;>
        .chat-container { max-width: 600px; margin: auto; background: #>
        .messages { max-height: 400px; overflow-y: auto; margin-bottom:>
        input, button { width: 100%; padding: 12px; margin-top: 10px; b>
        h2 { color: cyan; }
      </style>
    </head>
    <body>
      <div class="chat-container">
        <h2>Ngobrol sama <span id="botName">IxizAI</span></h2>
        <div class="messages" id="chatLog">
          <p><b>IxizAI:</b> Halo! Gue AI gratis powered by OpenRouter. >
        </div>
        <input type="text" id="userInput" placeholder="Tulis pertanyaan>
        <button onclick="sendMsg()">Kirim</button>
      </div>
      <script>
        async function sendMsg() {
          const input = document.getElementById("userInput");
          const chatLog = document.getElementById("chatLog");
          const userMessage = input.value;
          if (!userMessage.trim()) return;

          chatLog.innerHTML += \`<p><b>Lo:</b> \${userMessage}</p>\`;
          input.value = "";

          const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
          });

          const data = await res.json();
          chatLog.innerHTML += \`<p><b>IxizAI:</b> \${data.reply}</p>\`;
          chatLog.scrollTop = chatLog.scrollHeight;
        }

        document.getElementById("userInput").addEventListener("keypress>
          if (e.key === "Enter") sendMsg();
        });
      </script>
    </body>
    </html>
  `);
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        { role: 'system', content: 'Kamu adalah asisten AI bernama Ixiz>
        { role: 'user', content: message }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Maaf, AI error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
