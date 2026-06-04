# Document Model: README.md

This document defines the schema, structure, and validation rules for the root `README.md` file.

## Document Structure (Schema)

The `README.md` is divided into two primary sequential sections (English and Portuguese), each having an identical structure but localized content.

### Global Header

- **Centered Logo**: `public/icons/icon128.png` wrapped in a centered HTML paragraph tag.
- **Language Switcher**: Jump links separating the two main sections.

---

### English Section (`#gf-code-site-to-markdown`)

1. **Title**: `GF Code: Site to Markdown`
2. **Overview**: Description of the Chrome Extension.
3. **Features List**:
   - Clean Extraction
   - Hybrid Deduplication
   - LLM-Optimized Output
   - Token-Count Splitting
   - User-Controlled Popup
   - Site Scanning / Same-Domain Directory Crawling
4. **Installation Guide**:
   - Step-by-step for Chromium browsers via Developer Mode.
5. **Usage Guide**:
   - Quick instructions for using the popup and scanning.
6. **Repository Folder Structure**:
   - ASCII Tree layout.
7. **Development & Testing**:
   - Commands: `npm install`, `npm run test`, `npm run test:coverage`, `npm run test:dry`, `npm run test:all`.
8. **Constitution Principles**:
   - 5 Core Principles and 3 Technical Constraints.
9. **License**:
   - MIT License declaration.

---

### Portuguese Section (`#gf-code-site-to-markdown-pt`)

1. **Title**: `GF Code: Site to Markdown (Português)`
2. **Overview**: Localized description.
3. **Features List**: Localized features.
4. **Installation Guide**: Localized step-by-step.
5. **Usage Guide**: Localized instructions.
6. **Repository Folder Structure**: Localized folder structure explanation (tree is shared or localized).
7. **Development & Testing**: Localized command descriptions.
8. **Constitution Principles**: Localized principles and constraints.
9. **License**: Localized MIT License declaration.

---

## Validation & Constraints

- **Broken Links**: All relative links must exist in the repository (e.g., `docs/crawler.md`, `docs/extractors.md`).
- **Local Assets**: All image paths must be relative (e.g., `public/icons/icon128.png`). No HTTP/HTTPS external image assets.
- **Bilingual Consistency**: The features and instructions in both sections must match in functionality.
