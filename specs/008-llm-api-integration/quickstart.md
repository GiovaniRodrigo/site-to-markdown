# Quickstart Validation Guide: LLM Markdown Improvement

This guide describes the manual and automated validation procedures to verify that the LLM API Integration works correctly.

---

## Prerequisites

1. **Local Server (for local model testing)**: Start a local Ollama instance:
   ```bash
   ollama run llama3
   ```
   *Make sure Ollama is listening on `http://localhost:11434`.*
2. **Developer Credentials (for cloud model testing)**: Have a Gemini API key or OpenAI API key handy.
3. **Build Dependencies**: Ensure all package dependencies are installed:
   ```bash
   npm install
   ```

---

## Validation Scenario 1: Configuration & Connection Test (Manual)

### Steps:
1. Load the extension in developer mode in Chrome (`chrome://extensions/`).
2. Click the extension icon in the toolbar to open the **Popup UI**.
3. Navigate to the **LLM Settings Panel** (click the gear icon or toggle to Settings view).
4. Set **Provider** to `Ollama`, and leave the Endpoint as default (`http://localhost:11434`).
5. Click **Test Connection**.

### Expected Outcome:
* A checkmark or success message "Connection Successful!" appears next to the button.
* If Ollama is turned off, an error message "Endpoint unreachable" is cleanly displayed.

---

## Validation Scenario 2: Manual Markdown Refinement (Manual)

### Steps:
1. Visit a complex web page (e.g., a Wikipedia page).
2. Open the extension popup, make sure LLM settings are saved, but **Auto-Refine** is turned **OFF**.
3. Click **Extract Content**.
4. Review the extracted markdown in the preview window.
5. Click the **"Improve with LLM"** button.
6. A spinner and text "Refining markdown with LLM..." appears.
7. Once finished, check the text.

### Expected Outcome:
* The preview pane updates with the LLM-improved content.
* The download link is updated to download the improved version.
* Layout artifacts (like random bracket numbers or mobile menu remnants) are cleanly formatted or removed.

---

## Validation Scenario 3: Automated Test Suite (Automated)

### Command:
Run the Vitest test suite to verify model request builders and error fallbacks:
```bash
npm run test
```

### Expected Outcome:
* The tests verifying:
  * Local storage serialization of `LLMConfig`
  * Correct API payload formatting for Gemini, OpenAI, Anthropic, and Ollama
  * Timeout recovery and original markdown fallback
  All pass successfully.
