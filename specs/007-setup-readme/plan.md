# Implementation Plan: Setup README

**Branch**: `007-setup-readme` | **Date**: 2026-06-04 | **Spec**: [specs/007-setup-readme/spec.md](file:///home/giovani/Documents/projects/site-markdown/specs/007-setup-readme/spec.md)

**Input**: Feature specification from `/specs/007-setup-readme/spec.md`

## Summary

Establish the project's root `README.md` containing complete English and Portuguese versions. The document will start with a centered extension logo, followed by a language switcher (anchor links). It will describe all key features, provide browser installation instructions, document the repository folder structure, explain development commands, summarize the project constitution's core principles and technical constraints, and detail the MIT license.

## Technical Context

**Language/Version**: Markdown (GitHub Flavored Markdown)

**Primary Dependencies**: None (Standard markdown renderers)

**Storage**: N/A

**Testing**: Manual visual review in Markdown viewer (GitHub/Brave/Edge) and link verification.

**Target Platform**: GitHub / Local Markdown previewers

**Project Type**: Documentation

**Performance Goals**: Instant rendering (<50ms) and zero broken links.

**Constraints**: No external web/CDN dependencies for the logo/assets; must use `public/icons/icon128.png`.

**Scale/Scope**: 1 `README.md` file in the repository root.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Clean Extraction)**: Passed (Not applicable to this documentation task).
- **Principle II (Hybrid Deduplication & Ambiguity Resolution)**: Passed. Design ambiguities resolved via a grill-me interview.
- **Principle III (LLM-Optimized Output Formatting)**: Passed (Not applicable).
- **Principle IV (Token-Count Splitting & Flexible Packaging)**: Passed (Not applicable).
- **Principle V (User-Controlled Configuration Popup)**: Passed (Not applicable).
- **Technical Constraint 1 (Client-Side Execution)**: Passed. No external assets or CDN references.
- **Technical Constraint 2 (Vanilla Stack)**: Passed. Standard Markdown structure with minimal standard HTML (`<p align="center">`) for layout.
- **Technical Constraint 3 (Local Bundling)**: Passed. Uses local paths (`public/icons/icon128.png`) for icons/images.

## Project Structure

### Documentation (this feature)

```text
specs/007-setup-readme/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Spec checklist
```

### Source Code (repository root)

```text
README.md                # Bilingual documentation file (NEW)
```

**Structure Decision**: Single root file `README.md` containing both languages sequentially, allowing immediate onboarding for developers and users.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
