import { decryptApiKey } from "./crypto";

export interface ChatCompletionRequest {
  model: string;
  messages: { role: string; content: string }[];
  temperature: number;
  systemPrompt: string;
  apiKey: { encrypted: string; iv: string; tag: string };
}

export interface ChatCompletionResponse {
  content: string;
  tokensUsed?: number;
}

/** Map response style to temperature */
export function getTemperature(style: string): number {
  const temps: Record<string, number> = {
    precise: 0.2,
    balanced: 0.7,
    creative: 1.2,
  };
  return temps[style] ?? 0.7;
}

/** Call Gemini API */
/** Call Gemini API with retry + fallback */
async function callGemini(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
  const apiKey = decryptApiKey(req.apiKey);
  
  // Fallback models if primary fails
  const models = [req.model, "gemini-2.5-flash-lite", "gemini-1.5-flash", "gemini-1.5-pro"];
  let lastError;
  
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: req.systemPrompt }] },
              ...req.messages.map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
              })),
            ],
            generationConfig: { temperature: req.temperature },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          
          // Retry on 503 (unavailable) or 429 (rate limit)
          if (response.status === 503 || response.status === 429) {
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
            continue;
          }
          
          throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        const tokensUsed = data.usageMetadata?.totalTokenCount;

        return { content, tokensUsed };
        
      } catch (error: any) {
        lastError = error;
        
        // Retry on network errors or 503
        if (error.message?.includes("503") || error.message?.includes("429") || error.message?.includes("fetch")) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        
        break; // Non-retryable error, try next fallback model
      }
    }
  }
  
  throw lastError;
}

/** Call OpenAI API */
async function callOpenAI(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
  const apiKey = decryptApiKey(req.apiKey);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: req.model,
      messages: [
        { role: "system", content: req.systemPrompt },
        ...req.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: req.temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    tokensUsed: data.usage?.total_tokens,
  };
}

/** Call Claude API */
async function callClaude(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
  const apiKey = decryptApiKey(req.apiKey);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: req.model,
      max_tokens: 4096,
      system: req.systemPrompt,
      messages: req.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      temperature: req.temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return {
    content: data.content?.[0]?.text ?? "",
    tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
  };
}

/** Call OpenRouter API */
async function callOpenRouter(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
  const apiKey = decryptApiKey(req.apiKey);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
      "X-Title": "Chatbot Builder",
    },
    body: JSON.stringify({
      model: req.model,
      messages: [
        { role: "system", content: req.systemPrompt },
        ...req.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: req.temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    tokensUsed: data.usage?.total_tokens,
  };
}

/** Route to correct provider */
export async function callProvider(
  provider: string,
  req: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  switch (provider) {
    case "gemini":
      return callGemini(req);
    case "openai":
      return callOpenAI(req);
    case "claude":
      return callClaude(req);
    case "openrouter":
      return callOpenRouter(req);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}