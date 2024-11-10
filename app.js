const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// Helper function for streaming response
const streamToResponse = (stream, res) => {
  stream.on('data', (chunk) => {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      res.write(content);
    }
  });

  stream.on('end', () => {
    res.end();
  });

  stream.on('error', (error) => {
    console.error('Stream error:', error);
    res.status(500).end();
  });
};

// Main API endpoint for processing messages
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-405b-instruct",
      messages: [{ "role": "user", "content": message }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      stream: true
    });

    streamToResponse(completion, res);

  } catch (error) {
    console.error('Error processing request:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});