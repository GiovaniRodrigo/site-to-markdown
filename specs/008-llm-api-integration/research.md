# Research: LLM API Integration for Markdown Improvement

## Overview

This document details the technical research and architecture choices for integrating local and cloud LLM APIs into the Site-to-Markdown extension.

---

## Key Decisions

### 1. API Call Execution Environment
* **Decision**: All LLM API requests MUST be executed in the extension's background service worker (`background.js`) rather than in the popup or content scripts.
* **Rationale**: 
  * Content scripts are bound by the page's Content Security Policy (CSP), which often blocks connections to external API endpoints.
  * MV3 background service workers run in a privileged extension environment and are not subject to web page CSPs. They can perform arbitrary `fetch` requests.
  * Running calls in the background service worker allows request persistence even if the popup is closed by the user during a long LLM generation.
* **Alternatives Considered**: 
  * *Direct call in popup.js*: Rejected because if the user clicks away from the popup, the popup window closes, aborting the active fetch request.

### 2. Supported Providers and Integration Schema
* **Decision**: We will support Gemini, OpenAI, Anthropic, and Ollama. For maximum simplicity, we will implement direct endpoint fetches using standard REST schemas.
* **Rationale**:
  * **Gemini**: Simple REST API with API key in URL. Excellent context window (1M tokens).
  * **OpenAI**: Industry-standard chat completions endpoint.
  * **Anthropic**: High-quality refinement model.
  * **Ollama**: Local, open-source model execution. Runs on `http://localhost:11434` with an OpenAI-compatible API or standard `/api/chat` endpoint.
* **Endpoints**:
  * **Gemini**: `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}`
  * **OpenAI**: `POST https://api.openai.com/v1/chat/completions` (Header: `Authorization: Bearer {apiKey}`)
  * **Anthropic**: `POST https://api.anthropic.com/v1/messages` (Headers: `x-api-key: {apiKey}`, `anthropic-version: 2023-06-01`)
  * **Ollama**: `POST {customEndpoint}/api/chat` or `POST {customEndpoint}/v1/chat/completions` (Default: `http://localhost:11434`)

### 3. Prompt Engineering & Response Formats
* **Decision**: Use a system prompt instructing the model to return *only* the refined markdown without markdown code block wrappers (e.g. no \`\`\`markdown tags wrapping the output) unless the file itself is a code file.
* **Prompt**:
  ```text
  You are an expert technical writer and markdown optimizer.
  Your task is to refine and clean up the provided web-extracted markdown content.
  Instructions:
  1. Maintain the original information, headers, and meaning exactly.
  2. Fix layout reconstruction errors, weird spacings, and broken table alignments.
  3. Prune residual HTML tags, scripts, and duplicate header/footer text that escaped DOM parsing.
  4. Ensure all links and images are preserved exactly.
  5. Return ONLY the refined markdown. Do not wrap the output in markdown code blocks like ```markdown. Start directly with the content.
  ```

---

## API Schemas (Contracts)

### Gemini API
* **Request**:
  ```json
  {
    "contents": [{
      "parts": [{"text": "PROMPT + MARKDOWN_CONTENT"}]
    }]
  }
  ```
* **Response Extract Path**: `candidates[0].content.parts[0].text`

### OpenAI API
* **Request**:
  ```json
  {
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "system", "content": "SYSTEM_PROMPT"},
      {"role": "user", "content": "MARKDOWN_CONTENT"}
    ]
  }
  ```
* **Response Extract Path**: `choices[0].message.content`

### Anthropic API
* **Request**:
  ```json
  {
    "model": "claude-3-5-sonnet-20240620",
    "max_tokens": 4000,
    "messages": [
      {"role": "user", "content": "SYSTEM_PROMPT\n\nMarkdown Content:\nMARKDOWN_CONTENT"}
    ]
  }
  ```
* **Response Extract Path**: `content[0].text`

---

## Edge Case Mitigations

* **Context Window limits**: For Ollama and cloud endpoints with smaller defaults, we will add a character count limit check (e.g. 32k characters ~8k tokens). If content exceeds this, we will prompt the user to choose to refine only the first chunk or skip LLM refinement.
* **CORS / Host Permissions**: In `manifest.json`, we must declare host permission access or rely on user-allowed origins. For safety, background script fetch works without host permissions in MV3 for cross-origin APIs under extension standard behavior, but declaring standard API hosts in `manifest.json` under `permissions` or `host_permissions` ensures stability:
  ```json
  "host_permissions": [
    "https://generativelanguage.googleapis.com/*",
    "https://api.openai.com/*",
    "https://api.anthropic.com/*",
    "http://localhost:11434/*"
  ]
  ```
