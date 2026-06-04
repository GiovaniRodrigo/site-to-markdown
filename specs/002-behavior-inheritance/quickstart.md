# Quickstart: Extractor Inheritance Framework

This guide outlines how to verify the Extractor Inheritance Framework.

## Run Verification Scenarios

### 1. Extractor Registry Resolution Test
Verify that the `ExtractorRegistry` correctly maps hostnames to their respective extractor subclasses.

- **Setup**: Ensure `src/extractors/BaseExtractor.js`, `src/extractors/GenericExtractor.js`, `src/extractors/WikipediaExtractor.js`, and `src/extractors/ExtractorRegistry.js` are implemented.
- **Command**: Run the registry resolution unit tests.
  ```bash
  npm run test -- src/extractors/ExtractorRegistry.test.js
  ```
- **Expected Outcome**: 
  - `https://en.wikipedia.org/wiki/Main_Page` resolves to `WikipediaExtractor`.
  - `https://example.com` resolves to `GenericExtractor`.

### 2. Extractor Lifecycle Pipeline Test
Verify that the `BaseExtractor` executes all pipeline hooks in the correct sequence.

- **Setup**: Create a spy/mock class extending `BaseExtractor` that logs hook execution order.
- **Command**: Run the pipeline lifecycle unit tests.
  ```bash
  npm run test -- src/extractors/BaseExtractor.test.js
  ```
- **Expected Outcome**:
  - The `extract(dom)` method returns a formatted markdown document.
  - The logged sequence matches: `preprocessDOM` -> `extractContent` -> `postprocessMarkdown` -> `deduplicate` -> `formatOutput`.
