import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

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
        body { font-family: sans-serif; background: #111; color: white; padding: 20px; }
        .chat-container { max-width: 600px; margin: auto; background: #222; padding: 20px; border-radius: 12px; }
        .messages { max-height: 400px; overflow-y: auto; margin-bottom: 15px; border: 1px solid #333; padding: 10px; border-radius: 8px; background: #000; }
        input, button { width: 100%; padding: 12px; margin-top: 10px; background: #333; color: white; border: none; border-radius: 6px; }
        h2 { color: cyan; }
      </style>
    </head>
    <body>
      <div class="chat-container">
        <h2>Ngobrol sama <span id="botName">IxizAI</span></h2>
        <div class="messages" id="chatLog">
          <p><b>IxizAI:</b> Halo! Gue AI gratis powered by OpenRouter. Mau nanya apa?</p>
        </div>
        <input type="text" id="userInput" placeholder="Tulis pertanyaan kamu..." />
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
            body: JSON.stringify({ message: userMessage }),
          });

          const data = await res.json();
          chatLog.innerHTML += \`<p><b>IxizAI:</b> \${data.reply}</p>\`;
          chatLog.scrollTop = chatLog.scrollHeight;
        }

        document.getElementById("userInput").addEventListener("keypress", function(e) {
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
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: 'Kamu adalah asisten AI bernama IxizAI.' },
        { role: 'user', content: message },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Maaf, AI error.' });
  }
});

app.listen(PORT, () => console.log(\`Server jalan di http://localhost:\${PORT}\`));
