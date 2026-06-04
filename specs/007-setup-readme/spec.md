# Feature Specification: Setup README

**Feature Branch**: `007-setup-readme`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "README.md"

## Clarifications

### Session 2026-06-04

- Q: How should the bilingual English/Portuguese sections be structured and navigated in the README? → A: Sequential blocks with a top-level language switcher (anchor links at the very top pointing to English / Portuguese sections).
- Q: What visual styling and formatting elements should be used to make the README.md feel premium? → A: Rich visual style using GitHub-style alerts, shields/badges, detailed folder tree, and clean tables for commands/features.
- Q: What is the official project name that should be used in the README.md? → A: "GF Code: Site to Markdown" (as specified in the assumptions).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Bilingual README (Priority: P1)

As a developer or new user visiting the repository, I want to read a comprehensive README file in both English and Portuguese so that I can quickly understand what the extension does, how to use it, how to install it, how the codebase is structured, and how to run tests.

**Why this priority**: Essential onboarding documentation for both end-users and developers to understand the project structure, features, and capabilities.

**Independent Test**: Verify that the `README.md` file exists in the root directory, contains all key sections (Features, Installation, Usage, Structure, Testing, Principles, and License), and has separate English and Portuguese sections.

**Acceptance Scenarios**:

1. **Given** no README.md file exists in the root, **When** the README creation task is complete, **Then** a `README.md` file is created at the repository root.
2. **Given** the new README.md file is created, **When** rendered in a markdown preview, **Then** the extension logo (public/icons/icon128.png) is centered at the top of the file.
3. **Given** the README.md is created, **When** reviewed for bilingual content, **Then** it contains the complete English documentation first, followed by the complete Portuguese documentation.

---

### Edge Cases

- **Relative Asset Paths**: The image reference to the extension logo must use the relative path `public/icons/icon128.png` so that it renders correctly both on GitHub/GitLab and in local Markdown previewers.
- **Reference Document Integrity**: All links to internal documentation (such as `docs/crawler.md` and `docs/extractors.md`) must be checked to ensure they are valid and pointing to the correct files.
- **Markdown Format Compliance**: The final `README.md` must not contain unescaped HTML tag syntax (except for the centered image wrapper if needed, like `<p align="center">`) to keep it clean and standard.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST create a `README.md` file in the root directory of the repository.
- **FR-002**: The `README.md` file MUST be structured as bilingual parallel sections, with the complete English documentation first, followed by the complete Portuguese documentation.
- **FR-003**: The `README.md` MUST embed the extension logo `public/icons/icon128.png` centered at the top of the document.
- **FR-004**: The `README.md` MUST list and explain the key features of the extension (Clean Extraction, Hybrid Deduplication, LLM-Optimized Output, Token-Count Splitting, User-Controlled Popup, Site scanning).
- **FR-005**: The `README.md` MUST provide a step-by-step browser installation guide detailing how to load the extension in developer mode on Chromium-based browsers.
- **FR-006**: The `README.md` MUST document the folder structure of the repository.
- **FR-007**: The `README.md` MUST document development commands including dependencies installation (`npm install`), running tests (`npm run test`), coverage (`npm run test:coverage`), and code duplication checking (`npm run test:dry`).
- **FR-008**: The `README.md` MUST briefly summarize the project constitution's core principles and technical constraints.
- **FR-009**: The `README.md` MUST explicitly declare that the project is licensed under the MIT License.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The `README.md` file is present in the root directory.
- **SC-002**: All markdown links and image sources inside `README.md` resolve correctly (no 404s).
- **SC-003**: The markdown file is clean, well-formatted, and renders perfectly in a standard Markdown viewer without layout issues.

## Assumptions

- The name of the extension is "GF Code: Site to Markdown".
- The target browser environment for the extension is Chromium (Chrome, Edge, Brave, etc.).
- The logo file `public/icons/icon128.png` exists in the repository.
