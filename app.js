const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey:
    "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",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

async function main(message) {
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

  for await (const chunk of completion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}
message = "what's chupacabra?";
main(message);