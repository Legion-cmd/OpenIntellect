const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // чтобы HTML/JS работали локально

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY=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,
});

app.post("/ask", async (req, res) => {
  const question = req.body.message;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 секунд

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
    }, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Ошибка при обращении к OpenAI:", error.message);
    res.json({ reply: "Ошибка: не удалось получить ответ от ИИ." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
