// background.js - Site-to-Markdown Extension Background Worker

if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'testLLMConnection') {
      handleTestConnection(request.config)
        .then(result => sendResponse(result))
        .catch(err => sendResponse({ success: false, error: err.message }));
      return true; // Keep message channel open for async response
    }

    if (request.action === 'improveMarkdown') {
      handleImproveMarkdown(request.config, request.content)
        .then(result => sendResponse(result))
        .catch(err => sendResponse({ success: false, error: err.message }));
      return true; // Keep message channel open for async response
    }
  });
}

async function handleTestConnection(config) {
  const { llmProvider, llmApiKey, llmModel, llmCustomEndpoint } = config;
  const timeoutMs = 15000;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let url = '';
    let headers = { 'Content-Type': 'application/json' };
    let body = {};

    if (llmProvider === 'gemini') {
      const apiKey = llmApiKey ? llmApiKey.trim() : '';
      const model = llmModel ? llmModel.trim() : 'gemini-1.5-flash';
      url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      body = {
        contents: [{ parts: [{ text: 'ping' }] }]
      };
    } else if (llmProvider === 'openai') {
      const apiKey = llmApiKey ? llmApiKey.trim() : '';
      url = llmCustomEndpoint ? llmCustomEndpoint.trim() : 'https://api.openai.com/v1/chat/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
      body = {
        model: llmModel ? llmModel.trim() : 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5
      };
    } else if (llmProvider === 'anthropic') {
      const apiKey = llmApiKey ? llmApiKey.trim() : '';
      url = llmCustomEndpoint ? llmCustomEndpoint.trim() : 'https://api.anthropic.com/v1/messages';
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      body = {
        model: llmModel ? llmModel.trim() : 'claude-3-5-sonnet-20240620',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'ping' }]
      };
    } else if (llmProvider === 'ollama') {
      const endpoint = llmCustomEndpoint ? llmCustomEndpoint.trim() : 'http://localhost:11434';
      url = `${endpoint}/api/chat`;
      body = {
        model: llmModel ? llmModel.trim() : 'llama3',
        messages: [{ role: 'user', content: 'ping' }],
        stream: false
      };
    } else {
      throw new Error(`Unsupported provider: ${llmProvider}`);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      let detail = '';
      try {
        const json = JSON.parse(errText);
        detail = json.error?.message || json.error || errText;
      } catch (e) {
        detail = errText;
      }
      return { success: false, error: `API error (${res.status}): ${detail}` };
    }

    return { success: true };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return { success: false, error: 'Connection timed out after 15 seconds.' };
    }
    return { success: false, error: err.message };
  }
}

async function handleImproveMarkdown(config, content) {
  const { llmProvider, llmApiKey, llmModel, llmCustomEndpoint, llmPromptTemplate, llmObjective } = config;
  const timeoutMs = 25000;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let url = '';
    let headers = { 'Content-Type': 'application/json' };
    let body = {};

    const systemPrompt = llmPromptTemplate || `You are an expert technical writer and markdown optimizer.
Your task is to refine and clean up the provided web-extracted markdown content.
Instructions:
1. Maintain the original information, headers, and meaning exactly.
2. Fix layout reconstruction errors, weird spacings, and broken table alignments.
3. Prune residual HTML tags, scripts, and duplicate header/footer text that escaped DOM parsing.
4. Ensure all links and images are preserved exactly.
5. Return ONLY the refined markdown. Do not wrap the output in markdown code blocks like \`\`\`markdown. Start directly with the content.`;

    const userInstructions = llmObjective 
      ? `Goal/Objective: ${llmObjective}\n\nMarkdown Content:\n${content}`
      : `Markdown Content:\n${content}`;

    if (llmProvider === 'gemini') {
      const apiKey = llmApiKey ? llmApiKey.trim() : '';
      const model = llmModel ? llmModel.trim() : 'gemini-1.5-flash';
      url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      body = {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userInstructions}`
          }]
        }]
      };
    } else if (llmProvider === 'openai') {
      const apiKey = llmApiKey ? llmApiKey.trim() : '';
      url = llmCustomEndpoint ? llmCustomEndpoint.trim() : 'https://api.openai.com/v1/chat/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
      body = {
        model: llmModel ? llmModel.trim() : 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInstructions }
        ]
      };
    } else if (llmProvider === 'anthropic') {
      const apiKey = llmApiKey ? llmApiKey.trim() : '';
      url = llmCustomEndpoint ? llmCustomEndpoint.trim() : 'https://api.anthropic.com/v1/messages';
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      body = {
        model: llmModel ? llmModel.trim() : 'claude-3-5-sonnet-20240620',
        max_tokens: 4000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userInstructions}` }
        ]
      };
    } else if (llmProvider === 'ollama') {
      const endpoint = llmCustomEndpoint ? llmCustomEndpoint.trim() : 'http://localhost:11434';
      url = `${endpoint}/api/chat`;
      body = {
        model: llmModel ? llmModel.trim() : 'llama3',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInstructions }
        ],
        stream: false
      };
    } else {
      throw new Error(`Unsupported provider: ${llmProvider}`);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      let detail = '';
      try {
        const json = JSON.parse(errText);
        detail = json.error?.message || json.error || errText;
      } catch (e) {
        detail = errText;
      }
      throw new Error(`API error (${res.status}): ${detail}`);
    }

    const data = await res.json();
    let improvedMarkdown = '';

    if (llmProvider === 'gemini') {
      improvedMarkdown = data.candidates?.[0]?.content?.parts?.[0]?.text;
    } else if (llmProvider === 'openai') {
      improvedMarkdown = data.choices?.[0]?.message?.content;
    } else if (llmProvider === 'anthropic') {
      improvedMarkdown = data.content?.[0]?.text;
    } else if (llmProvider === 'ollama') {
      improvedMarkdown = data.message?.content;
    }

    if (!improvedMarkdown) {
      throw new Error('Received empty response from the model.');
    }

    return { success: true, improvedMarkdown };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Refinement request timed out.');
    }
    throw err;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { handleTestConnection, handleImproveMarkdown };
}
