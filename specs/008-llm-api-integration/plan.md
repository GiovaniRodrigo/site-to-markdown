# Implementation Plan: LLM API Integration for Markdown Improvement

**Branch**: `008-llm-api-integration` | **Date**: 2026-06-11 | **Spec**: [specs/008-llm-api-integration/spec.md](file:///home/giovani/Documents/projects/site-markdown/specs/008-llm-api-integration/spec.md)

**Input**: Feature specification from `/specs/008-llm-api-integration/spec.md`

## Summary

Integrate local and cloud LLM capabilities into the Site-to-Markdown extension to improve the readability, formatting, and structural quality of extracted markdown content. All API requests will run within the extension background script (`background.js`) to bypass web page Content Security Policies and handle long requests securely. Settings for providers (Gemini, OpenAI, Anthropic, Ollama), API keys, default models, custom endpoints, and manual vs. automatic triggers will be managed via the extension popup.

## Technical Context

**Language/Version**: JavaScript (ES6+ Modules, standard browser APIs)

**Primary Dependencies**: Web Extensions API (`chrome.storage.local`, `chrome.runtime`), and bundled `Readability.js`/`Turndown.js`.

**Storage**: `chrome.storage.local` for persisting LLM configuration keys, providers, and auto-refine preference.

**Testing**: Vitest (`npm run test`) with mock fetch and extension API environments.

**Target Platform**: Google Chrome / WebExtensions-compliant browsers (Manifest V3).

**Project Type**: Browser Extension

**Performance Goals**: API request timeout of 15 seconds, non-blocking UI behavior, clear progress spinners, and graceful fallback in under 2 seconds.

**Constraints**:
* Client-Side Execution: No centralized extension server proxy; direct browser-to-API communication.
* Secure Key Storage: Cloud keys are saved locally inside `chrome.storage.local` and transmitted only to the respective API endpoint.
* Privacy warning: A warning notice is displayed in the UI when cloud LLM providers are active.

**Scale/Scope**:
* Update popup HTML/CSS to include an "LLM Configuration" panel and a "Improve with LLM" trigger button.
* Update `popup.js` to manage connection tests, save configuration state, and coordinate markdown improvement requests.
* Update `background.js` to expose message handlers that perform HTTP POST requests directly to Gemini, OpenAI, Anthropic, or Ollama endpoints, including error handling and fallbacks.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Clean Extraction)**: Passed. Readability/Turndown extracts clean text before sending to LLM.
- **Principle II (Hybrid Deduplication & Ambiguity Resolution)**: Passed. The raw markdown is deduplicated prior to LLM processing.
- **Principle III (LLM-Optimized Output Formatting)**: Passed. Prompts explicitly instruct the model to produce clean markdown, retaining metadata.
- **Principle IV (Token-Count Splitting & Flexible Packaging)**: Passed. LLM improvement will be applied to chunks before zip packing, with warnings for huge files.
- **Principle V (User-Controlled Configuration Popup)**: Passed. Settings are accessible via a configuration sub-panel in the popup UI.
- **Technical Constraint 1 (Client-Side Execution)**: *Conditional Pass*. Use of external APIs is permitted under the explicit condition that keys are managed locally by the client, and a privacy warning is presented to the user. An offline option (Ollama) is available to preserve absolute local execution.
- **Technical Constraint 2 (Vanilla Stack)**: Passed. Pure Vanilla JS/HTML/CSS without compilation.
- **Technical Constraint 3 (Local Bundling)**: Passed.

## Project Structure

### Documentation (this feature)

```text
specs/008-llm-api-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── messages.md      # Message passing schema
└── checklists/
    └── requirements.md  # Spec checklist
```

### Source Code (repository root)

```text
manifest.json            # Contains permissions
background.js            # Background worker executing LLM fetch calls (MODIFY)
popup/
├── popup.html           # Popup UI with LLM configuration & trigger controls (MODIFY)
├── popup.css            # Styles for configuration panel, connection checks, and loaders (MODIFY)
└── popup.js             # Logic for managing settings and sending messages to background (MODIFY)
```

**Structure Decision**: Single-project web extension. Modifying UI popup elements and integrating direct HTTP fetch logic in the background worker.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Constraint 1: External API connections | The user requested option to link with cloud LLMs (Gemini, OpenAI, Anthropic) to improve content quality. | Restricting to local Ollama only was rejected because many users do not have local hardware capable of running LLMs. |
