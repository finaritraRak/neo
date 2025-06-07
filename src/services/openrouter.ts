// src/services/openrouter.ts
export async function askAI(messages: { role: string; content: string }[]) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`,  // remplace par ta clé API OpenRouter
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages,
      }),
    });
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }
  
    const data = await response.json();
    return data.choices[0].message.content;
  }
  