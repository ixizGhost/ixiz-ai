// File: api/chat.js
export default async function handler(req, res) {
  const { message } = req.body;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer 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",
      "Content-Type": "application/json",
      "HTTP-Referer": "https://ixizghost.github.io",
      "X-Title": "IxizAI"
    },
    body: JSON.stringify({
      model: "moonshotai/kimi-k2:free",
      messages: [
        { role: "system", content: "Kamu adalah IxizAI, asisten pintar dan ramah." },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
