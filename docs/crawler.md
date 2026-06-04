# Same-Domain Directory Crawler

The Same-Domain Directory Crawler allows users to extract clean markdown from all pages linked within the same directory path of a site.

## How it Works

1. **Triggering**: Click the **Scan Directory** button in the extension popup.
2. **Link Harvesting**: The popup injects `content.js` into the active tab to extract all anchor tags (`<a>`) from the page.
3. **Filtering Heuristic**: The harvested links are filtered to only keep URLs that:
   - Match the exact same origin (protocol, hostname, and port).
   - Start with the same parent path prefix (e.g., if you are on `/docs/intro`, only links starting with `/docs/` are crawled).
   - Are not the starting page itself.
   - Do not contain trailing duplicate pages (trailing slashes and hash fragments are normalized).
4. **Background Extraction**: The filtered URLs are crawled sequentially via the background `fetch()` API. Each fetched page is parsed locally inside the popup context using `DOMParser`, cleaned of layout/navigation noise, and converted to markdown via `Readability` + `Turndown` + deduplication.
5. **Progress & Control**: The popup displays live progress of the crawl. The user can abort the crawl at any time by clicking the **Cancel** button.
6. **ZIP Compilation**: Upon completion, all extracted pages are bundled into a ZIP file using `JSZip` and downloaded automatically.
