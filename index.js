import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI with API key from environment variable
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Endpoint: Correct Setup Summary grammar & convert to bullet points
app.post("/summary", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No text provided" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a technical implementation note editor.
Rewrite the text using:
- Clear grammar
- Concise professional tone
- Bullet points
Do NOT add new information.
`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    res.json({
      cleaned: response.choices[0].message.content
    });

  } catch (err) {
    console.error("Error in /summary:", err);
    res.status(500).json({ error: "Failed to process text" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

