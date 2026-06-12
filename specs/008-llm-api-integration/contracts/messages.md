# Extension Messaging Contracts

This document outlines the message passing contracts between the popup UI (`popup.js`) and the background service worker (`background.js`).

---

## 1. Action: `improveMarkdown`

Sent by the popup UI to trigger the LLM optimization process within the background context.

### Request Payload

```json
{
  "action": "improveMarkdown",
  "config": {
    "llmProvider": "gemini",
    "llmApiKey": "AIzaSy...",
    "llmModel": "gemini-1.5-flash",
    "llmCustomEndpoint": "",
    "llmPromptTemplate": "...",
    "llmObjective": "Summarize key points"
  },
  "content": "# Extracted Title\n\nPage text content here..."
}
```

### Response Payload (Success)

```json
{
  "success": true,
  "improvedMarkdown": "# Extracted Title\n\nOptimized and cleaned page text content..."
}
```

### Response Payload (Error)

```json
{
  "success": false,
  "error": "Failed to authenticate: API key invalid"
}
```

---

## 2. Action: `testLLMConnection`

Sent by the configuration view in the popup to validate settings before saving.

### Request Payload

```json
{
  "action": "testLLMConnection",
  "config": {
    "llmProvider": "gemini",
    "llmApiKey": "AIzaSy...",
    "llmModel": "gemini-1.5-flash",
    "llmCustomEndpoint": ""
  }
}
```

### Response Payload (Success)

```json
{
  "success": true
}
```

### Response Payload (Error)

```json
{
  "success": false,
  "error": "Endpoint unreachable: Network Error"
}
```
