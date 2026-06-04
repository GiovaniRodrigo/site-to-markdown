# Data Model: Extractor Inheritance Framework

## Data Structures

### ExtractorOptions
Configuration object passed to the extractor constructor to govern behavior.
- `tokenLimit`: (number) Limit of characters/tokens for file splitting (default: 4000).
- `deduplicationSimilarity`: (number) Sensitivity threshold for similarity checking (default: 0.85).
- `multiFile`: (boolean) Whether to enable file splitting (default: false).

### ExtractionResult
Result payload returned by `BaseExtractor.extract()`.
- `markdown`: (string) Fully formatted output markdown text (or combined text if multi-file).
- `chunks`: (Array<string>) Array of split markdown chunks (if multi-file is enabled).
- `metadata`: (ExtractorMetadata) Metadata generated for frontmatter.

### ExtractorMetadata
Information gathered for frontmatter generation.
- `title`: (string) Document title.
- `url`: (string) Absolute URL of the webpage.
- `timestamp`: (string) ISO timestamp of extraction.
- `totalChunks`: (number) Total number of split files.
- `chunkIndex`: (number) Current file index.

### RegistryEntry
An object inside the `ExtractorRegistry` table.
- `pattern`: (string) Hostname match string (e.g. `*.wikipedia.org`).
- `constructor`: (Class Reference) The extractor subclass constructor to instantiate.
