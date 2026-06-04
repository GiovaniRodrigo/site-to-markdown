# Feature Specification: Same-Domain Directory Crawler

**Feature Branch**: `005-scan-domain-directories`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "get and scan directories from same domain"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Same-Domain Directory Scan & Extraction (Priority: P1)

The user wants to trigger a scan of the current page for all links belonging to the same domain and starting with the same path prefix, retrieve their content silently in the background, extract their markdown, and download all extracted markdown documents compiled together.

**Why this priority**: This is the core capability that enables bulk/batch extraction of structured sections of websites (such as a documentation directory or blog section) in a single action, drastically improving efficiency over manual page-by-page extraction.

**Independent Test**: The user navigates to a documentation site (e.g. `https://example.com/docs/intro`), opens the extension, and clicks the directory scan button. The extension scans `https://example.com/docs/intro` for links, filters them to find all links under the same prefix `/docs/`, silently extracts the content of those linked pages, and provides a download of a ZIP folder containing the markdown files.

**Acceptance Scenarios**:

 1. **Given** the user is viewing a page at `https://example.com/docs/intro`, **When** they trigger a directory scan, **Then** the extension extracts all links from the page and filters them to include only URLs that share the same origin (`https://example.com`) and start with the same path prefix (`/docs/`), excluding the current page.
2. **Given** the filtered list of matching links, **When** the scan proceeds, **Then** the extension retrieves the HTML content for each page in the background, and runs the standard extraction and deduplication pipeline on each page.
3. **Given** the scan finishes, **When** all pages have been successfully extracted and "Multi-file (ZIP)" mode is enabled, **Then** the extension compiles all extracted markdown files into a single ZIP archive and triggers a browser download.

---

### User Story 2 - Scan Progress UI & Cancel Action (Priority: P2)

The user wants to see the progress of the scanning and extraction process in the popup and be able to cancel the operation at any time.

**Why this priority**: Crawling multiple pages takes time depending on network latency. Providing progress feedback keeps the user informed, and a cancel option prevents the user from feeling trapped if the site is slow or contains too many pages.

**Independent Test**: The user starts the directory scan on a page containing 15 links. The popup displays progress showing the number of pages processed. The user clicks "Cancel" mid-way, and the scan stops immediately, resetting the interface without starting a download.

**Acceptance Scenarios**:

1. **Given** a directory scan is running, **When** the extension processes the pages, **Then** the popup displays progress (e.g., "Crawling 3 of 12 pages"), disables the start scan button, and enables a "Cancel" button.
2. **Given** a directory scan is running, **When** the user clicks the "Cancel" button, **Then** the scan immediately halts, active network requests are aborted, and the popup UI resets to the idle state.

---

### User Story 3 - Single Consolidated File Extraction (Priority: P2)

The user wants to download all crawled directory pages compiled into a single Markdown file when the multi-file setting is disabled.

**Why this priority**: It allows users who want a single consolidated document (for example, to feed a complete documentation section into an LLM context as a single prompt) to extract it with a single click, rather than having to unzip and manually merge separate files.

**Independent Test**: The user unchecks "Multi-file (ZIP)" in the popup settings, navigates to a documentation section, and clicks "Scan Directory". Once the crawl finishes, the extension triggers a download of a single `.md` file (e.g. `example_title_crawled.md`) containing all successfully crawled pages.

**Acceptance Scenarios**:

1. **Given** the "Multi-file (ZIP)" option is unchecked (disabled), **When** a directory scan is completed successfully, **Then** the extension compiles the markdown from all successfully extracted pages into a single Markdown file and triggers a browser download.
2. **Given** the extension is compiling the single consolidated file, **When** the file is generated, **Then** it MUST contain a global frontmatter block at the top, followed by each page's content separated by a markdown heading (`## [Page Title] - [URL]`) and a horizontal rule (`---`).

---

### Edge Cases

- **No matching links found**: If the current page does not contain any links matching the same domain and path prefix, the popup should display a friendly message: "No same-domain directory links found on this page." and disable starting the scan.
- **Failed fetches**: If a page fails to load or return content, the extension should skip it, log the error, and continue processing the rest of the pages. The final ZIP bundle or consolidated file should still contain all successfully extracted pages.
- **URL Normalization**: The crawler must normalize links to prevent duplicate requests (e.g. ignoring trailing slashes, anchor hashes like `#section`, and variations in protocols).
- **Starting page exclusion**: The starting page itself (the active tab's URL) must be excluded from the crawled page list to avoid redundant extraction.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The extension popup MUST display a prominent action button to start scanning directory pages from the same domain.
- **FR-002**: Triggering the scan MUST extract all links from the active tab's page content.
- **FR-003**: The system MUST filter the extracted links to only include those belonging to the same protocol, host, and port as the active page, and starting with the same path prefix (parent folder path) as the active page.
- **FR-004**: The system MUST normalize all filtered URLs and remove duplicate links, including any links that point back to the starting page.
- **FR-005**: The system MUST retrieve the content of each filtered link sequentially or concurrently in the background without opening new visible tabs.
- **FR-006**: The system MUST parse the retrieved content of each page and run the standard content isolation, clean markdown conversion, and deduplication logic.
- **FR-007**: While scanning is active, the popup MUST display progress status (such as number of processed pages out of total matching links) and disable other actions except for a cancel button.
- **FR-008**: The popup MUST display a "Cancel" button during scanning which immediately stops all background retrieval and resets the UI to idle.
- **FR-009**: When the "Multi-file (ZIP)" option is enabled, the system MUST bundle all successfully extracted markdown files into a ZIP archive and prompt the user to download it.
- **FR-010**: When the "Multi-file (ZIP)" option is disabled, the system MUST compile all successfully extracted markdown contents into a single consolidated Markdown file and prompt the user to download it.
- **FR-011**: The single consolidated Markdown file MUST contain a global frontmatter block at the top containing metadata (starting page title, starting page URL, timestamp, total page count, and a list of all successfully scanned source URLs) followed by each page's content separated by markdown headings (`## [Title] - [URL]`) and horizontal rules.

### Key Entities

- **Directory Scan Job**: Represents the active multi-page scanning task. Key attributes include:
  - Starting page URL and path prefix
  - Target URL list (filtered and normalized links)
  - Current status (idle, scanning, compiling, completed, cancelled, error)
  - Progress state (number of pages completed out of total target URLs)
  - Collection of successfully extracted markdown documents (each with title, URL, and body content)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Scanning and URL filtering is initiated within 150ms of clicking the scan button.
- **SC-002**: The popup UI updates the progress count within 100ms of any individual page extraction completing.
- **SC-003**: Clicking the "Cancel" button halts all background network requests and UI animations within 100ms.
- **SC-004**: The ZIP or single file download prompt is triggered within 2 seconds of successfully completing the extraction of the last page.

## Assumptions

- The browser environment allows background network requests (`fetch`) to the same origin without blocking.
- The target pages are standard HTML pages whose content is populated in the initial HTML or does not require complex client-side Javascript execution to be readable (as background fetch will not execute page scripts).
- Standard extension storage is available to read existing settings (e.g. deduplication threshold) to apply during the scan.
