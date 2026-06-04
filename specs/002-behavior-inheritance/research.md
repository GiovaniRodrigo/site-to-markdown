# Research: Extractor Inheritance Framework

## Decisions

### 1. Extractor Pipeline Lifecycle Hooks
- **Decision**: Enforce a strict sequential pipeline of hook methods (`preprocessDOM`, `extractContent`, `postprocessMarkdown`, `deduplicate`, `formatOutput`) inside the `BaseExtractor.extract(dom)` method.
- **Rationale**: Ensures that critical processing steps (like metadata injection, duplicate checking, and Turndown conversion) are always executed in the same order, regardless of custom site-specific extraction rules.
- **Alternatives Considered**: Direct method overriding of `extract()` (rejected because subclasses could forget to call super methods or miss metadata injection rules).

### 2. ExtractorRegistry Matching Pattern
- **Decision**: Match page URL hostnames using wildcard host patterns (e.g., `*.wikipedia.org`).
- **Rationale**: Standard wildcards easily handle subdomains and cross-region versions of popular websites without bloating the routing table.
- **Alternatives Considered**: Hardcoded exact domain string comparison (rejected because it does not support subdomains out of the box).
