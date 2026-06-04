# Interface Contracts: Message Passing

This document describes the message exchange contract between the Extension Popup (`popup.js`) and the Tab Content Script (`content.js`).

## 1. Extract Links Message

To initiate scanning, the popup script requests the list of all anchor links from the active tab.

### Request

Sent from `popup.js` to `content.js` in the active tab.

```json
{
  "action": "extract_links"
}
```

### Response

Returned by `content.js` to `popup.js`.

```json
{
  "success": true,
  "links": [
    {
      "href": "https://example.com/docs/getting-started",
      "text": "Getting Started"
    },
    {
      "href": "https://example.com/docs/api-reference",
      "text": "API Reference"
    }
  ]
}
```

If an error occurs:

```json
{
  "success": false,
  "error": "Detailed description of the error."
}
```

## 2. Extract Page Content Message (Fallback or Ad-hoc)

Note: The existing `extract_content` message format continues to be supported for single-page extraction:

```json
{
  "action": "extract_content",
  "settings": {
    "similarityThreshold": 0.85
  }
}
```
