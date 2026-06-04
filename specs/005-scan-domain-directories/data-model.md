# Data Model: Same-Domain Directory Crawler

This document describes the in-memory state structures and configurations used for the directory scanning and extraction process.

## 1. Directory Scan Job (In-Memory State)

The `DirectoryScanJob` represents the state of an active or completed directory scanning operation in the popup.

| Field | Type | Description |
|---|---|---|
| `status` | `string` | Current status of the job: `'idle' \| 'scanning' \| 'compiling' \| 'completed' \| 'cancelled' \| 'error'` |
| `startUrl` | `string` | The URL of the page from which the scan was initiated. |
| `pathPrefix` | `string` | The path prefix calculated from the parent directory of `startUrl` (e.g. `/docs/`). |
| `urlsToCrawl` | `Array<string>` | Normalized and deduplicated list of URLs identified for crawling. |
| `currentIndex` | `number` | The 0-based index of the URL currently being crawled. |
| `results` | `Array<ExtractedPage>` | List of successfully extracted page objects. |
| `errors` | `Array<{url: string, error: string}>` | List of crawler errors encountered during fetches. |
| `abortController` | `AbortController \| null` | Controller used to abort active fetch operations when the user cancels. |

## 2. Extracted Page Entity

Represents a single crawled page's extracted data.

| Field | Type | Description |
|---|---|---|
| `url` | `string` | The full source URL of the extracted page. |
| `title` | `string` | The title of the page parsed from the page HTML. |
| `markdown` | `string` | The clean, post-processed and deduplicated markdown string. |

## 3. Crawler Configuration / Settings

These are the configuration settings read from `chrome.storage.local` or popup inputs.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `singleFile` | `boolean` | `true` | When true, compiles all results into a single consolidated file; when false, packages them as a ZIP archive. |
| `similarityThreshold` | `number` | `0.85` | Deduplication character similarity threshold (used in deduplication). |
| `concurrency` | `number` | `1` | Number of simultaneous HTTP fetches. |
| `timeout` | `number` | `10000` | HTTP fetch timeout in milliseconds. |
