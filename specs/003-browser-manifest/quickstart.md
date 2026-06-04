# Quickstart Guide: Browser Extension Manifest Configuration

This guide describes how to verify the configuration of the browser extension manifest.

## Prerequisites

- A Chromium-based browser (Google Chrome, Microsoft Edge, or Brave).
- Extension directory with the newly created `manifest.json` at its root.
- Placeholder stub files created at:
  - `background.js`
  - `content.js`
  - `popup/popup.html`
  - `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`

## Setup and Stub Command

To create placeholders/stubs for testing (if they do not exist), run:

```bash
mkdir -p popup icons
touch background.js content.js popup/popup.html
# Create temporary placeholder images
convert -size 16x16 xc:blue icons/icon16.png
convert -size 48x48 xc:blue icons/icon48.png
convert -size 128x128 xc:blue icons/icon128.png
```

## Validation Scenarios

### Scenario 1: JSON Schema Validation

Validate the `manifest.json` file syntax and structure.

**Validation Command**:
Run validation using a JSON Schema tool or node runner script:
```bash
npx ajv-cli validate -s specs/003-browser-manifest/contracts/manifest-schema.json -d manifest.json
```

**Expected Outcome**:
The schema validator reports that `manifest.json` is valid.

### Scenario 2: Unpacked Load in Chrome

Verify the extension loads within the browser environment.

**Instructions**:
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the project root directory.

**Expected Outcome**:
- The extension loads without any manifest-related schema warnings or validation error prompts.
- The extension displays:
  - Name: `Minha Extensão`
  - Version: `1.0.0`
  - Description: `Exemplo básico de extensão MV3`
- The permissions displayed in Details include Storage, Scripting, ActiveTab, and Access to all sites.
