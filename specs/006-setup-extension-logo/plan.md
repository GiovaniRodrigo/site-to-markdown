# Implementation Plan: Setup Extension Logo

**Branch**: `006-setup-extension-logo` | **Date**: 2026-06-04 | **Spec**: [specs/006-setup-extension-logo/spec.md](file:///home/giovani/Documents/projects/site-markdown/specs/006-setup-extension-logo/spec.md)

**Input**: Feature specification from `/specs/006-setup-extension-logo/spec.md`

## Summary

Extract four PNG files (`icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`) from the source `GF_Markdown_Extractor.ico` file. Save these icons under a new `public/icons/` directory at the project root, update the `manifest.json` file to reference them under the `"icons"` property, and completely delete the old `icons/` directory and its assets to ensure a clean codebase.

## Technical Context

**Language/Version**: Javascript (ES6)

**Primary Dependencies**: ImageMagick (`convert`) or Python (PIL) for build-time icon extraction

**Storage**: N/A

**Testing**: Manual validation in a Chromium-based developer mode extension

**Target Platform**: Chromium-based browsers (Chrome, Edge, Brave) supporting Manifest V3

**Project Type**: web-extension

**Performance Goals**:
- Extension loads instantly.
- Icons are sharp and match the requested resolutions exactly.

**Constraints**:
- Must run entirely locally in the browser with zero external calls.
- Purely client-side extension structure.

**Scale/Scope**: manifest update, directory deletion, new asset directory configuration.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Clean Extraction)**: Passed (Not applicable to this feature).
- **Principle II (Hybrid Deduplication & Ambiguity Resolution)**: Passed (Not applicable to this feature).
- **Principle III (LLM-Optimized Output Formatting)**: Passed (Not applicable to this feature).
- **Principle IV (Token-Count Splitting & Flexible Packaging)**: Passed (Not applicable to this feature).
- **Principle V (User-Controlled Configuration Popup)**: Passed (Not applicable to this feature).
- **Technical Constraint 1 (Client-Side Execution)**: Passed (No external APIs or services contacted).
- **Technical Constraint 2 (Vanilla Stack)**: Passed (No JS build frameworks or bundlers required).
- **Technical Constraint 3 (Local Bundling)**: Passed (All extension assets bundled locally).

## Project Structure

### Documentation (this feature)

```text
specs/006-setup-extension-logo/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
public/
└── icons/               # New icon assets location
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
manifest.json            # Manifest file referencing public/icons/
GF_Markdown_Extractor.ico # Source file for icons
```

**Structure Decision**: Single project layout. We will create the `public/icons/` folder, generate the icons into it, update `manifest.json`, and remove the legacy `icons/` directory.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
