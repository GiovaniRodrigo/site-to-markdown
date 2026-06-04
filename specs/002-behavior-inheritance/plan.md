# Implementation Plan: Extractor Inheritance Framework

**Branch**: `002-behavior-inheritance` | **Date**: 2026-06-04 | **Spec**: [specs/002-behavior-inheritance/spec.md](file:///home/giovani/Documents/projects/site-markdown/specs/002-behavior-inheritance/spec.md)

**Input**: Feature specification from `/specs/002-behavior-inheritance/spec.md`

## Summary
Implement a modular class hierarchy for page extractors, consisting of a base class `BaseExtractor` which structures a strict hook-based extraction pipeline, a `GenericExtractor` fallback, and site-specific subclasses (such as `WikipediaExtractor`) resolved dynamically by an `ExtractorRegistry` based on the active tab's hostname.

## Technical Context

**Language/Version**: ES6 Javascript (compatible with standard browser extension content scripts)

**Primary Dependencies**: None (standard DOM API, Readability.js, Turndown.js)

**Storage**: chrome.storage (for user configuration options, though not directly used by extractors)

**Testing**: Vitest + Playwright (as specified in `001-test-suite-validation`)

**Target Platform**: Chromium-based browsers (Chrome Extension API manifest v3)

**Project Type**: Browser Extension

**Performance Goals**: Pattern resolution <5ms, Extraction fallback <500ms

**Constraints**: Entirely local client-side execution, no external APIs

**Scale/Scope**: Lightweight scripts run in content scripts of matched pages.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Clean Extraction)**: Passed. BaseExtractor prunes hidden/noise elements using Readability.js before markdown conversion.
- **Principle II (Hybrid Deduplication)**: Passed. BaseExtractor applies text similarity thresholds.
- **Principle III (LLM-Optimized Format)**: Passed. BaseExtractor prefixes output with JSON/YAML frontmatter metadata.
- **Principle IV (Token-Count Splitting)**: Passed. Configurable splitting and packaging is supported (managed via popup UI calling the extractor).
- **Principle V (User Control)**: Passed. All extractor behaviors remain configurable.
- **Technical Constraint 1 (Client-Side)**: Passed. Runs completely local.
- **Technical Constraint 2 (Vanilla Stack)**: Passed. Vanilla JS.
- **Technical Constraint 3 (Local Bundling)**: Passed.

## Project Structure

### Documentation (this feature)

```text
specs/002-behavior-inheritance/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
└── extractors/
    ├── BaseExtractor.js      # Base abstract extractor class
    ├── GenericExtractor.js   # Generic fallback extractor
    ├── ExtractorRegistry.js  # Registry of extractors matched by active host
    └── WikipediaExtractor.js # Example site-specific extractor subclass
```

**Structure Decision**: Option 1: Single project. Source files will be organized under `src/extractors/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
