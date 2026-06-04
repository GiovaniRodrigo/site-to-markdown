<!--
SYNC IMPACT REPORT:
- Version change: None -> 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Clean Extraction (DOM-Based Isolation)
  - [PRINCIPLE_2_NAME] -> II. Hybrid Deduplication & Ambiguity Resolution
  - [PRINCIPLE_3_NAME] -> III. LLM-Optimized Output Formatting
  - [PRINCIPLE_4_NAME] -> IV. Token-Count Splitting & Flexible Packaging
  - [PRINCIPLE_5_NAME] -> V. User-Controlled Configuration Popup
- Added sections:
  - Technical Constraints
  - Development Workflow
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (✅ updated)
  - .specify/templates/tasks-template.md (✅ updated)
- Follow-up TODOs: None
-->

# Site-to-Markdown Extension Constitution

## Core Principles

### I. Clean Extraction (DOM-Based Isolation)
The extension MUST isolate the primary page content using Readability.js. Before conversion, the extension MUST prune elements that are hidden (e.g. `display: none`, `visibility: hidden`) or contain navigation noise, scripts, and styling rules to prevent duplicate layout structures (such as desktop vs. mobile header/footer rendering).

### II. Hybrid Deduplication & Ambiguity Resolution
The extension MUST filter out repeated or redundant content blocks. It MUST perform duplicate checking on text blocks by combining exact matching and a similarity threshold heuristic (e.g., character match similarity >85%). If a block matches an already extracted block, it MUST be discarded.

### III. LLM-Optimized Output Formatting
Extracted markdown MUST be formatted specifically for LLM ingestion. Every generated file MUST contain a structured frontmatter metadata block (including page Title, source URL, date extracted, chunk index, and total chunk count) followed by clean Markdown. Restrict the output to strict markdown format, discarding raw HTML tags or script fragments.

### IV. Token-Count Splitting & Flexible Packaging
The extension MUST support splitting content into multiple files based on a configurable token or character-count limit (e.g., 4000 characters). When splitting is enabled, files MUST be compiled and downloaded as a ZIP archive using JSZip. If disabled, the entire content MUST be downloaded as a single consolidated Markdown file.

### V. User-Controlled Configuration Popup
All extraction, splitting, and deduplication settings MUST be configurable via a Browser Action popup UI. This popup MUST provide sliders and toggles for single vs. multi-file mode, character-count threshold, and deduplication/similarity sensitivity, alongside a preview pane showing metadata.

## Technical Constraints

1. **Client-Side Execution**: The extension MUST run entirely locally in the browser. No external API, proxy, or data gathering servers may be contacted to preserve user privacy and data security.
2. **Vanilla Stack**: The extension UI and background/content scripts MUST be built using Vanilla HTML, CSS, and JS (Web Extensions API) to remain compile-free, lightweight, and fast.
3. **Local Bundling**: Any third-party libraries (Readability.js, Turndown.js, JSZip) MUST be packaged locally within the extension directory, rather than loaded from CDNs.

## Development Workflow

1. **Structure Integrity**: The extension directory structure MUST follow the standard Web Extensions format (having `manifest.json`, background, content scripts, and popups).
2. **Quality Gates**: All core components (the extractor, post-processor, and deduplication algorithm) should be modular and tested against a variety of page layouts (blogs, SPAs, documentation).

## Governance

- The Constitution represents the absolute guidelines for development.
- Any future changes to the core functionalities, tech stack, or rules require an official amendment to this constitution.
- Bumping the constitution version follows semantic versioning rules: MAJOR for breaking changes, MINOR for new principles/features, and PATCH for typo fixes and clarifications.

**Version**: 1.0.0 | **Ratified**: 2026-06-04 | **Last Amended**: 2026-06-04
