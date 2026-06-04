# Implementation Plan: Browser Extension Manifest Configuration

**Branch**: `003-browser-manifest` | **Date**: 2026-06-04 | **Spec**: [specs/003-browser-manifest/spec.md](file:///home/giovani/Documents/projects/site-markdown/specs/003-browser-manifest/spec.md)

**Input**: Feature specification from `/specs/003-browser-manifest/spec.md`

## Summary

Configure and implement the `manifest.json` file for the Site-to-Markdown browser extension, targeting Manifest V3 (MV3). This configuration registers the background service worker, content scripts, toolbar actions with an associated popup, extension icons, and scopes permissions to `storage`, `activeTab`, and `scripting` across all URLs.

## Technical Context

**Language/Version**: JSON (manifest schema version 3 specification)

**Primary Dependencies**: None (Standard browser APIs)

**Storage**: chrome.storage (for user configuration preferences, though not directly managed by the manifest config itself)

**Testing**: Manual installation on Chromium-based browser via developer options (Developer Mode)

**Target Platform**: Chromium-based browsers (Chrome, Brave, Edge) supporting MV3

**Project Type**: web-extension

**Performance Goals**: Instant extension load times (<10ms) and zero parser warning/errors

**Constraints**: Local execution only; no external network requests or CDN dependencies (Core Principle I & Technical Constraint 1)

**Scale/Scope**: 1 manifest.json file, references to stub files for content script, background script, popup, and static icon assets

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Clean Extraction)**: Passed. Permission scopes in the manifest include `activeTab` and `scripting` which are necessary for DOM-based isolation.
- **Principle II (Hybrid Deduplication & Ambiguity Resolution)**: Passed. No direct influence.
- **Principle III (LLM-Optimized Output Formatting)**: Passed. No direct influence.
- **Principle IV (Token-Count Splitting & Flexible Packaging)**: Passed. `storage` permission allows reading splitter configurations, and local resource loading supports compilation.
- **Principle V (User-Controlled Configuration Popup)**: Passed. The manifest specifies `popup/popup.html` under the toolbar action.
- **Technical Constraint 1 (Client-Side Execution)**: Passed. No permissions or host configurations enable external proxy connections.
- **Technical Constraint 2 (Vanilla Stack)**: Passed. Standard web technologies referenced (HTML, CSS, JS).
- **Technical Constraint 3 (Local Bundling)**: Passed. All assets and script paths in the manifest are local.

## Project Structure

### Documentation (this feature)

```text
specs/003-browser-manifest/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── checklists/
│   └── requirements.md  # Spec checklist
└── contracts/
    └── manifest-schema.json # JSON Schema for extension manifest
```

### Source Code (repository root)

```text
manifest.json            # Extension entrypoint configuration
background.js            # Background service worker script (stub)
content.js               # Content script injected into pages (stub)
popup/
└── popup.html           # Settings popup user interface (stub)
icons/
├── icon16.png           # 16x16 icon (stub)
├── icon48.png           # 48x48 icon (stub)
└── icon128.png          # 128x128 icon (stub)
```

**Structure Decision**: Single project. The `manifest.json` file is placed at the root of the workspace, referencing local files for background workers, popups, and scripts to construct a standard Chromium web extension layout.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
