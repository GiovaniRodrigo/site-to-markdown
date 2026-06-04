# Implementation Plan: Same-Domain Directory Crawler

**Branch**: `005-scan-domain-directories` | **Date**: 2026-06-04 | **Spec**: [specs/005-scan-domain-directories/spec.md](file:///home/giovani/Documents/projects/site-markdown/specs/005-scan-domain-directories/spec.md)

**Input**: Feature specification from `/specs/005-scan-domain-directories/spec.md`

## Summary

Implement the Same-Domain Directory Crawler for the Site-to-Markdown browser extension. This feature extracts all links on the active page, filters them to find pages sharing the same protocol, host, and port and the same path prefix (parent folder), fetches their HTML in the background, and extracts clean markdown using the standard pipeline. If "Multi-file (ZIP)" mode is enabled, it bundles the extracted files into a ZIP archive; if disabled, it compiles them into a single consolidated Markdown file. In either case, it triggers a browser download. The popup UI will be updated to display progress and support cancellation.

## Technical Context

**Language/Version**: Javascript (ES6), HTML5, CSS3 (Vanilla stack)

**Primary Dependencies**: Chrome Extension APIs (`chrome.tabs`, `chrome.downloads`, `chrome.scripting`), Readability.js, Turndown.js, JSZip

**Storage**: `chrome.storage.local` (for settings/configurations)

**Testing**: Vitest for helper logic; manual validation in a Chromium-based developer mode extension

**Target Platform**: Chromium-based browsers (Chrome, Edge, Brave) supporting Manifest V3

**Project Type**: web-extension

**Performance Goals**:
- Scan initialization < 150ms.
- Progress updates < 100ms.
- ZIP packaging/file consolidation and download trigger < 2s after final fetch completes.

**Constraints**:
- Must run entirely locally (no external APIs, proxies, or servers).
- Must utilize vanilla Javascript, HTML, and CSS (no UI frameworks or build steps).

**Scale/Scope**: popup UI extensions, message-passing handler in `content.js`, background fetching logic, and JSZip compilation.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Clean Extraction)**: Passed. Retrieved pages are parsed via `DOMParser` and run through the existing isolation pipeline (Readability.js, pruning hidden elements).
- **Principle II (Hybrid Deduplication & Ambiguity Resolution)**: Passed. Every fetched page runs through the character-similarity deduplication check using configured thresholds.
- **Principle III (LLM-Optimized Output Formatting)**: Passed. Outputs include standard frontmatter metadata blocks with title, source url, extraction date, and part details.
- **Principle IV (Token-Count Splitting & Flexible Packaging)**: Passed. If the multi-file option is enabled, the crawled files are bundled together into a ZIP archive using the locally loaded JSZip library. If disabled, they are compiled into a single consolidated Markdown file with a global frontmatter metadata block.
- **Principle V (User-Controlled Configuration Popup)**: Passed. Action buttons, progress updates, and a cancel button are integrated directly into the popup.
- **Technical Constraint 1 (Client-Side Execution)**: Passed. Fetches are made directly from the popup context, entirely local.
- **Technical Constraint 2 (Vanilla Stack)**: Passed. Uses vanilla JS, HTML, and CSS.
- **Technical Constraint 3 (Local Bundling)**: Passed. Readability, Turndown, and JSZip are already bundled locally and will be loaded in the popup.

## Project Structure

### Documentation (this feature)

```text
specs/005-scan-domain-directories/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── contracts/
│   └── messages.md      # Message passing contracts
└── quickstart.md        # Quickstart validation guide
```

### Source Code (repository root)

```text
content.js               # Message listener for link harvesting
popup/
├── popup.html           # Popup UI markup (adds scan controls & scripts)
├── popup.js            # Popup controller logic (fetching, crawler job, ZIP compilation)
└── popup.css            # Styles for crawler progress and controls
```

**Structure Decision**: Single project layout. We will extend the existing popup elements (`popup.html`, `popup.js`, `popup.css`) and content scripts (`content.js`).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
