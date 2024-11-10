const express = require('express');
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey:
    "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",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

async function getCompletion(message) {
  const completion = await openai.chat.completions.create({
    model: "meta/llama-3.1-405b-instruct",
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    temperature: 0.5,
    top_p: 1,
    max_tokens: 1024,
    stream: true,
  });

  let result = "";
  for await (const chunk of completion) {
    result += chunk.choices[0]?.delta?.content || "";
  }

  return result;
}

// POST endpoint to handle incoming messages
app.post('/message', async (req, res) => {
  const { message } = req.body; // Get message from request body
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await getCompletion(message); // Get OpenAI completion
    res.status(200).json({ response }); // Send the OpenAI response back
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});