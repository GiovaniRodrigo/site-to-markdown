# Feature Specification: Extractor Inheritance Framework

**Feature Branch**: `002-behavior-inheritance`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "utilizar funcionalidade de herança para aplicar comportamentos repetidos"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Base Extractor Pipeline (Priority: P1)

As a developer, I want a base class `BaseExtractor` that implements a standard extraction pipeline calling sequential lifecycle hooks, ensuring that all page extractors share the same core sequence (DOM preprocessing, text extraction, Markdown conversion, deduplication, and frontmatter formatting).

**Why this priority**: Defines the base pipeline contract that guarantees consistent outputs and satisfies core principles (metadata formatting and similarity deduplication).

**Independent Test**: Instantiate a dummy extractor subclass, call `extract(dom)`, and verify that all lifecycle hooks are executed in the correct sequence.

**Acceptance Scenarios**:

1. **Given** a subclass of `BaseExtractor`, **When** `extract(dom)` is executed, **Then** `preprocessDOM`, `extractContent`, `postprocessMarkdown`, `deduplicate`, and `formatOutput` are executed in order, returning the fully formatted Markdown.

---

### User Story 2 - Site-Specific Extractor Specialization (Priority: P2)

As a developer, I want to create specialized extractor subclasses (e.g. `WikipediaExtractor`) that inherit from `BaseExtractor` and override only specific lifecycle hooks (such as custom DOM selector isolation or removal of wiki-specific infoboxes) without duplicating the core HTML-to-Markdown or deduplication logic.

**Why this priority**: Minimizes code duplication (DRY) and allows writing very clean, focused site-specific parsers.

**Independent Test**: Mock a Wikipedia page DOM, run `WikipediaExtractor.extract()`, and assert that Wikipedia-specific navigation/sidebars are pruned while general text styling is successfully converted using the parent's Turndown logic.

**Acceptance Scenarios**:

1. **Given** a site-specific extractor class (e.g., `WikipediaExtractor` overriding `preprocessDOM`), **When** it processes a mock page, **Then** only the overridden hook behavior is altered, and standard parent logic (like markdown formatting) executes normally.

---

### User Story 3 - Extractor Registry & Resolution (Priority: P3)

As a developer, I want an `ExtractorRegistry` that parses the active tab's URL, matches it against registered host match patterns, and returns the appropriate specialized extractor class instance, defaulting to a `GenericExtractor` if no specific match is found.

**Why this priority**: Allows the content script to dynamically choose the best parser for the site currently being viewed by the user.

**Independent Test**: Pass different mock URLs to the registry resolve function and assert that the correct class instance (e.g., `WikipediaExtractor` vs. `GenericExtractor`) is returned.

**Acceptance Scenarios**:

1. **Given** the URL `https://en.wikipedia.org/wiki/Main_Page`, **When** `ExtractorRegistry.resolve(url)` is called, **Then** it returns an instance of `WikipediaExtractor`.
2. **Given** the URL `https://example.com`, **When** `ExtractorRegistry.resolve(url)` is called, **Then** it returns an instance of `GenericExtractor`.

---

### Edge Cases

- **Runtime Hook Failure**: If an overridden hook method in a specialized extractor throws a runtime error, `BaseExtractor` must catch it, log it, and fall back to the default implementation of that hook or the `GenericExtractor` flow to prevent UI crashes.
- **Multiple Match Patterns**: If a URL matches multiple registry patterns, the registry must resolve the most specific pattern (e.g. exact host match takes precedence over wildcard host match).
- **Abstract Hook Defaults**: To prevent subclasses from having to implement every single hook, `BaseExtractor` must provide default sensible implementations (e.g., no-op for `preprocessDOM`, and standard Readability.js-based isolation for `extractContent`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define a `BaseExtractor` class in `src/extractors/BaseExtractor.js`.
- **FR-002**: The `BaseExtractor` MUST define a master template method `extract(dom)` that calls the lifecycle hooks in the following sequence:
  1. `preprocessDOM(dom)`
  2. `extractContent(dom)` (yields raw content)
  3. `postprocessMarkdown(markdown)` (cleans text elements)
  4. `deduplicate(markdown)` (applies similarity thresholds)
  5. `formatOutput(markdown)` (adds frontmatter metadata)
- **FR-003**: The `BaseExtractor` MUST provide default implementations for all hooks, using Readability.js for `extractContent` and Turndown.js for Markdown conversion.
- **FR-004**: The system MUST implement a `GenericExtractor` in `src/extractors/GenericExtractor.js` that inherits from `BaseExtractor` and uses default hook behaviors.
- **FR-005**: The system MUST support site-specific extractor classes in `src/extractors/` (e.g. `WikipediaExtractor.js`) that inherit from `BaseExtractor` and override specific hooks.
- **FR-006**: The system MUST implement an `ExtractorRegistry` in `src/extractors/ExtractorRegistry.js` containing match patterns (wildcards or regex) mapping to extractor constructors.

### Key Entities *(include if feature involves data)*

- **BaseExtractor**: Base class defining the template method `extract` and default hook implementations.
- **GenericExtractor**: Standard fallback extractor subclass.
- **ExtractorRegistry**: Repository of registered extractors matched by active host.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Code duplication across different page extractors MUST be less than 5% (verified by the DRY validation tool).
- **SC-002**: Extractor pattern matching and resolution MUST take less than 5ms for any URL.
- **SC-003**: In case of a specialized hook crash, the system MUST fallback and complete extraction within 500ms using the default extractor pipelines.

## Assumptions

- Target browsers natively support ES6 classes without a transpiler.
- Extractors run inside the content script context where they can read and modify a copy of the active page's DOM.
