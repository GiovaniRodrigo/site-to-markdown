# Quickstart Validation Guide: Same-Domain Directory Crawler

This guide outlines how to verify the functionality of the Same-Domain Directory Crawler in development.

## Prerequisites

1. Chromium-based browser (Chrome, Edge, Brave, etc.) with Developer Mode enabled.
2. The Site-to-Markdown extension loaded as an unpacked extension.
3. Access to a local or public test website with subdirectories and links (e.g., standard documentation or blog).

## Setup & Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the project root folder: `/home/giovani/Documents/projects/site-markdown`.
5. Ensure the extension "GF Code: Site to Markdown" is active.

## Manual Verification Scenario 1: Same-Domain Scan & ZIP Download

1. Navigate to a documentation directory, e.g. `https://en.wikipedia.org/wiki/Special:AllPages` or a local testing page.
2. Click the extension icon to open the popup.
3. Verify that a new section or button for **Scan Directory** is visible in the popup.
4. Click **Scan Directory**.
5. Observe the UI:
   - The button should change to a disabled state or display "Crawling...".
   - A progress text (e.g. "Crawled 2 of 8 pages") should update as pages are processed.
6. Once the crawl completes, verify that a file download prompt is triggered for a ZIP archive (e.g., `Special_AllPages.zip`).
7. Open the ZIP archive and verify:
   - It contains markdown files for each successfully crawled subpage.
   - Each markdown file starts with a correct frontmatter metadata block containing the page title, URL, extraction date, and part details.

## Manual Verification Scenario 2: Cancelling a Scan

1. Open a page with many links under the same prefix.
2. Open the extension popup and click **Scan Directory**.
3. While progress is updating, click the **Cancel** button.
4. Verify that:
   - The crawl stops immediately.
   - The progress UI resets to "Ready to extract" or similar idle message.
   - No download dialog is prompted.

## Manual Verification Scenario 3: Same-Domain Scan & Single-File Download

1. Navigate to a documentation directory or blog section.
2. Click the extension icon to open the popup.
3. Uncheck the **Multi-file (ZIP)** toggle under Configuration (verify that Single-file mode is now active).
4. Click **Scan Directory**.
5. Observe progress indicators as they crawl matching pages.
6. Once the crawl completes, verify that a file download prompt is triggered for a single Markdown file (e.g., `Starting_Page_Title_crawled.md`).
7. Open the downloaded Markdown file and verify:
   - It begins with a single global frontmatter block containing starting page title, URL, timestamp, source count, and a list of all successfully scanned source URLs.
   - It lists each crawled page sequentially, separated by horizontal rules (`---`) and page-level markdown headings (`## [Title] - [URL]`).
