# Research: Same-Domain Directory Crawler

This document details the technical research, architectural decisions, and alternatives evaluated for implementing the Same-Domain Directory Crawler.

## Key Technical Decisions

### 1. Page Content Retrieval & Parsing

- **Decision**: Fetch each page HTML via the browser `fetch()` API directly in the extension popup context, parse the HTML string using `DOMParser`, and execute the `Readability` + `Turndown` pipeline locally in the popup context.
- **Rationale**: 
  - Using `fetch` in the extension popup context takes advantage of the extension's elevated host permissions (defined by `<all_urls>` in `manifest.json`), bypassing CORS restrictions.
  - It runs silently in the background without spawning visible/hidden browser tabs or disrupting the user's browsing experience.
  - `DOMParser` parses the response string into a standard DOM `Document` object which is fully compatible with `@mozilla/readability`.
- **Alternatives Considered**:
  - **Sequential Invisible/Hidden Tabs**: Creating temporary tabs with `chrome.tabs.create` in a minimized state, injecting `content.js` to extract markdown, and closing them.
    - *Why Rejected*: Spawning browser tabs is resource-heavy, slower, visually disruptive (even when minimized, they briefly flash in the tab bar), and introduces complex lifecycle/state management (e.g., handling tab closures or navigation errors).

### 2. Same-Domain & Directory Link Filtering

- **Decision**: Filter links extracted from the active page using a combination of **Same Origin** and **Path Prefix** matching.
  - **Same Origin**: Link must have the exact same protocol, hostname, and port as the active tab.
  - **Path Prefix**: Link path must start with the parent path directory of the active tab. The parent path is defined by removing the final segment of the active page's pathname (e.g., `/docs/intro` -> `/docs/`, `/blog/posts/first` -> `/blog/posts/`).
- **Rationale**:
  - Restricting the scan to the same path prefix ensures the crawler stays within the logical directory of interest (e.g., only docs, only blog posts) rather than scraping unrelated parts of the site (e.g., signup pages, pricing, contact pages).
- **Alternatives Considered**:
  - **Same Origin Only**: Allow any link on the same domain (e.g., on `example.com/docs/intro`, allow `example.com/checkout`).
    - *Why Rejected*: Too broad. It would fetch irrelevant links and significantly increase crawl time.
  - **Subdomain-Inclusive matching**: Allow crawling across subdomains (e.g., `blog.example.com` and `docs.example.com`).
    - *Why Rejected*: Broadens scope unnecessarily and complicates origin boundaries.

### 3. URL Normalization & Deduplication

- **Decision**: Normalize all links before crawling:
  - Parse each link href using the `URL` constructor.
  - Clear the hash fragment (`url.hash = ''`).
  - Normalize trailing slashes (e.g. remove trailing slash for consistent comparison).
  - Exclude the starting page's own URL.
  - Filter out duplicates.
- **Rationale**: Prevents infinite loops, redundant requests, and double-fetching identical content (e.g. `page.html` vs `page.html#section`).
- **Alternatives Considered**:
  - **Simple String Matching**: Matching raw strings directly.
    - *Why Rejected*: Highly prone to duplicates due to relative vs. absolute paths, tracking parameters, hashes, and protocol mismatches.

### 4. Crawl Concurrency and Rate Limiting

- **Decision**: Run the fetches sequentially (concurrency of 1) with an optional abort flag supported via `AbortController`.
- **Rationale**: 
  - Sequential execution is easy to track and display progress for (e.g., "Crawling 1 of 5").
  - It minimises the chance of trigger-happy rate limiting or IP bans from the target server.
  - If a fetch fails, the job can gracefully catch the error, log it, and continue to the next item.
- **Alternatives Considered**:
  - **Parallel/Concurrent Fetch**: Fetching all pages at once using `Promise.all`.
    - *Why Rejected*: Can overload the browser, trigger rate limiting, and makes progress reporting erratic.

### 5. Single File Consolidation Formatting

- **Decision**: Compile all crawled pages into a single Markdown file when Multi-file (ZIP) mode is disabled. The file begins with a global frontmatter block containing metadata (starting page title, starting page URL, timestamp, total page count, and a list of all successfully scanned source URLs) followed by each page's content separated by markdown headings (`## [Page Title] - [URL]`) and horizontal rules (`---`).
- **Rationale**:
  - A single global frontmatter keeps the Markdown document valid and clean for LLM ingestion.
  - Using standard Markdown headings (`## [Title] - [URL]`) and horizontal rules (`---`) makes it clear to both human readers and LLMs where one page ends and another begins.
- **Alternatives Considered**:
  - Concatenating all files directly, each with its own frontmatter block.
    - *Why Rejected*: Standard markdown parsers only expect one frontmatter block at the very top. Having multiple frontmatter blocks interspersed throughout the file breaks standard parsing and looks messy.
  - Using custom XML tags to separate pages.
    - *Why Rejected*: Not standard markdown, which could complicate downstream parsing.
