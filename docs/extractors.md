# Extractor Inheritance Framework Documentation

This framework allows the **Site-to-Markdown Extension** to handle site-specific extraction rules cleanly without duplicating code.

## Directory Structure

```text
src/extractors/
├── BaseExtractor.js      # Base class defining lifecycle pipeline
├── GenericExtractor.js   # Fallback extractor using Readability + Turndown
├── ExtractorRegistry.js  # Matches active hostnames to specialized classes
└── WikipediaExtractor.js # Example specialized wiki site extractor
```

---

## 1. Extractor Pipeline Lifecycle

The extraction process follows a strict sequential pipeline defined in `BaseExtractor.extract(dom)`:

1. **`preprocessDOM(dom)`**: Prunes hidden or layout-specific noise before isolating text.
2. **`extractContent(dom)`**: Extracts raw content using Readability.js.
3. **`postprocessMarkdown(markdown)`**: Performs site-specific markdown text formatting.
4. **`deduplicate(markdown)`**: Prunes redundant/duplicate content blocks using text similarity metrics.
5. **`formatOutput(markdown)`**: Wraps output in frontmatter metadata.

Every site-specific extractor inherits this sequence, guaranteeing consistent outputs.

---

## 2. Implementing a Custom Extractor

To customize behavior for a specific website (e.g. `github.com`), subclass `BaseExtractor` and override only the necessary hook methods:

```javascript
import { BaseExtractor } from "./BaseExtractor.js";

export class GitHubExtractor extends BaseExtractor {
  // Override preprocessDOM to strip code sidebar widgets and header panels
  preprocessDOM(dom) {
    if (dom && typeof dom.querySelectorAll === 'function') {
      const elementsToPrune = dom.querySelectorAll('.gh-header-actions, .repository-sidebar');
      for (const el of elementsToPrune) {
        el.remove();
      }
    }
    return dom;
  }
}
```

---

## 3. Registering Your Extractor

Add your new extractor mapping in the `ExtractorRegistry` class constructor:

```javascript
import { GitHubExtractor } from "./GitHubExtractor.js";
// ...

this.mappings = [
  { pattern: "*.wikipedia.org", classRef: WikipediaExtractor },
  { pattern: "wikipedia.org", classRef: WikipediaExtractor },
  { pattern: "*.github.com", classRef: GitHubExtractor } // Your new registration
];
```
The registry matches active URLs using wildcard patterns and returns the specialized class instance.
