import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors()); // allow requests from any frontend
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("notes-backend is running.");
});

// Endpoint: Correct Setup Summary
app.post("/summary", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No text provided" });
    }

    console.log("Received text for summary:", text);

    // Call OpenAI API
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
        { role: "user", content: text }
      ]
    });

    // Log OpenAI response for debugging
    console.log("OpenAI response:", response.choices[0].message.content);

    // Return cleaned text
    res.json({ cleaned: response.choices[0].message.content });
  } catch (err) {
    console.error("Error in /summary:", err);

    // Detailed error for logs, generic message for frontend
    res.status(500).json({ error: "Failed to process text. Check backend logs." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`notes-backend running on port ${PORT}`));
