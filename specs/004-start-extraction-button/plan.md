# Implementation Plan: Button Action for Start Extraction

**Branch**: `004-start-extraction-button` | **Date**: 2026-06-04 | **Spec**: [specs/004-start-extraction-button/spec.md](file:///home/giovani/Documents/projects/site-markdown/specs/004-start-extraction-button/spec.md)

**Input**: Feature specification from `/specs/004-start-extraction-button/spec.md`

## Summary

Implement the user interface trigger and runtime behavior for starting the extraction process in the Site-to-Markdown browser extension. This involves adding the "Start Extraction" button to the popup UI, listening for click events, injecting the extraction script (`content.js`) into the active tab via `chrome.scripting.executeScript`, handling progress/loading visual states, initiating the download of generated files, and displaying user-friendly error messages if the extraction fails or the page is restricted.

## Technical Context

**Language/Version**: Javascript (ES6), HTML5, CSS3 (Vanilla stack)

**Primary Dependencies**: Chrome Extension APIs (`chrome.scripting`, `chrome.tabs`, `chrome.downloads`, `chrome.runtime`)

**Storage**: chrome.storage.local (for retrieving user-configured thresholds and modes)

**Testing**: Vitest for helper logic; manual validation in a Chromium-based developer mode extension

**Target Platform**: Chromium-based browsers (Chrome, Edge, Brave) supporting Manifest V3

**Project Type**: web-extension

**Performance Goals**: UI responsiveness (button interaction feedback <50ms, content script injection <100ms)

**Constraints**: Completely local execution; no external APIs or servers allowed.

**Scale/Scope**: popup UI script integration, content/background script connection stub, downloads API trigger.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Clean Extraction)**: Passed. Triggers injection of `content.js` to run Readability.js and isolate the page.
- **Principle II (Hybrid Deduplication & Ambiguity Resolution)**: Passed. No direct logic, but extraction output will be passed to deduplication before file compilation.
- **Principle III (LLM-Optimized Output Formatting)**: Passed. Extracted data is formatted as LLM-ready markdown with frontmatter prior to download.
- **Principle IV (Token-Count Splitting & Flexible Packaging)**: Passed. Settings from storage guide whether single-file downloader or JSZip package downloader is invoked.
- **Principle V (User-Controlled Configuration Popup)**: Passed. The trigger button is placed in the configuration popup UI.
- **Technical Constraint 1 (Client-Side Execution)**: Passed. No remote calls are made.
- **Technical Constraint 2 (Vanilla Stack)**: Passed. Uses vanilla JS, HTML, CSS.
- **Technical Constraint 3 (Local Bundling)**: Passed. Third-party script dependencies are packaged locally.

## Project Structure

### Documentation (this feature)

```text
specs/004-start-extraction-button/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Spec checklist
```

### Source Code (repository root)

```text
manifest.json            # Extension entrypoint configuration
background.js            # Service worker handling runtime communication
content.js               # Content script injected into pages (stub)
popup/
├── popup.html           # Popup interface markup
├── popup.js            # Popup user interaction script
└── popup.css            # Popup stylesheet
```

**Structure Decision**: Single project layout. The extraction trigger and UI feedback live in `popup/popup.html`, `popup/popup.js`, and `popup/popup.css`. Background orchestration script is in `background.js` and content injection script is in `content.js`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
