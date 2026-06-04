# Quickstart Validation Guide: Button Action for Start Extraction

This guide details how to manually run and validate the "Start Extraction" button trigger and visual states in the Site-to-Markdown extension.

## Prerequisites

1. Chromium-based browser (Chrome, Edge, Brave).
2. Extensions page opened at `chrome://extensions/` with **Developer mode** enabled.
3. The extension built/loaded using the "Load unpacked" button, pointing to the project root directory.

## Validation Scenarios

### Scenario 1: Successful Single-File Extraction

1. Open any public documentation page (e.g., [https://spec-kit.github.io/](https://spec-kit.github.io/)).
2. Open the extension popup from the toolbar.
3. Keep the default configurations (Single file mode enabled).
4. Click the **Start Extraction** button.
5. **Expected Outcome**:
   - The button transitions to a loading state: text changes to "Extracting...", a loading indicator appears, and the button is disabled.
   - Within 2 seconds, a file download dialog appears for a `.md` file containing the extracted page.
   - The button transitions back to its default active state.

### Scenario 2: Action on Restricted Page

1. Navigate the active browser tab to `chrome://extensions/` or `chrome://settings/`.
2. Open the extension popup.
3. **Expected Outcome**:
   - The **Start Extraction** button is disabled, or a message is shown indicating extraction is not allowed on privileged browser internal pages.

### Scenario 3: Execution Error Handling

1. Open a local file (e.g. `file:///` path) without granting file access permission to the extension.
2. Open the popup and click **Start Extraction**.
3. **Expected Outcome**:
   - The button transitions to loading.
   - After script failure, the button resets, and a clear error message (e.g. "Access to this page is restricted") is displayed in the popup UI.
