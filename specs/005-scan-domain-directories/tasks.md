# Tasks: Same-Domain Directory Crawler

**Input**: Design documents from `/specs/005-scan-domain-directories/`

**Prerequisites**: [plan.md](plan.md) (required), [spec.md](spec.md) (required for user stories), [research.md](research.md), [data-model.md](data-model.md), [contracts/messages.md](contracts/messages.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root, `content.js` and `popup/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Basic setup and workspace preparation

- [x] T001 Verify active branch `005-scan-domain-directories` and ensure no uncommitted files exist

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core message handling and URL parsing helper methods required by the crawler

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Add message listener for `extract_links` action in `content.js` to return all anchor tags (`href` and `text`) on the current page
- [x] T003 Implement `parseAndFilterLinks(links, currentUrl)` function in `popup/popup.js` to filter links by same-origin and parent path prefix
- [x] T004 [P] Create unit tests for link filtering logic in `tests/extractors/UrlFilter.test.js`
- [x] T005 Load `lib/readability.js` and `lib/turndown.js` script dependencies in `popup/popup.html`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Same-Domain Directory Scan & Extraction (Priority: P1) 🎯 MVP

**Goal**: Crawl same-domain directory pages in the background, extract clean markdown, and bundle them into a ZIP archive for download.

**Independent Test**: Click "Scan Directory" button in popup; verify that the crawl starts, processes pages in the background, and prompts download of a ZIP containing clean markdown files.

### Implementation for User Story 1

- [x] T006 [US1] Implement link retrieval in `popup/popup.js` by messaging the active tab to execute the link harvesting script
- [x] T007 [US1] Implement sequential fetch queue with network request management in `popup/popup.js`
- [x] T008 [US1] Integrate `DOMParser`, `Readability`, and `TurndownService` in `popup/popup.js` to parse fetched HTML and convert to markdown
- [x] T009 [US1] Implement ZIP file generation and download triggering using `JSZip` in `popup/popup.js`
- [x] T010 [US1] Add the "Scan Directory" button to the popup UI in `popup/popup.html`

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Scan Progress UI & Cancel Action (Priority: P2)

**Goal**: Show progress state in the popup and allow immediate cancellation of active crawls.

**Independent Test**: Start scan and see "Crawled 3 of 10 pages...". Click "Cancel" and verify the crawl aborts immediately, active fetches cancel, and the UI resets.

### Implementation for User Story 2

- [x] T011 [US2] Add progress bar, scan state texts, and "Cancel" button markup in `popup/popup.html`
- [x] T012 [P] [US2] Style progress elements, loader animations, and cancel button layout in `popup/popup.css`
- [x] T013 [US2] Integrate crawler progress reporting into the crawl loop in `popup/popup.js`
- [x] T014 [US2] Implement abort logic using `AbortController` inside `popup/popup.js` to terminate active crawls

**Checkpoint**: User Story 2 is fully functional and integrated.

**Checkpoint**: User Story 2 is fully functional and integrated.

---

## Phase 5: User Story 3 - Single Consolidated File Extraction (Priority: P2)

**Goal**: Compile all crawled pages into a single Markdown file when the Multi-file option is disabled, starting with a global frontmatter block and separating page contents with horizontal rules and headers.

**Independent Test**: Uncheck "Multi-file (ZIP)" in the popup settings, click "Scan Directory", and verify that a single `.md` file with a global frontmatter is downloaded.

### Implementation for User Story 3

- [x] T015 [US3] Implement configuration check for `state.settings.singleFile` at the end of directory crawl completion in `popup/popup.js`
- [x] T016 [US3] Implement single-file consolidation logic (generating a global frontmatter block, and concatenating page sections with markdown headers and horizontal rules) in `popup/popup.js`
- [x] T017 [US3] Call `triggerDownload` with the compiled single-file content and sanitize starting page title filename in `popup/popup.js`

**Checkpoint**: User Story 3 is fully functional and testable independently.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, documentation, and final validation

- [x] T018 [P] Update spec, plan, research, data-model, and quickstart documentation in `specs/005-scan-domain-directories/`
- [x] T019 Run `npm test` to ensure all tests pass successfully
- [x] T020 Run manual verification flows outlined in `quickstart.md` to confirm end-to-end correctness

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all User Stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Independent of other stories.
- **User Story 2 (P2)**: Integrates with US1 progress states and crawl loops.
- **User Story 3 (P2)**: Integrates with US1 crawl loop to redirect output format when Multi-file mode is unchecked.

---

## Parallel Opportunities

- Unit tests (`T004`) can be written in parallel with utility functions (`T003`).
- CSS styling (`T012`) can be updated in parallel with progress state integration.
- Single-file formatting logic (`T016`) can be written in parallel with single-file download function call (`T017`).
- Documentation updates (`T018`) can run in parallel with final manual checkouts.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Implement US1 crawling pipeline and ZIP packaging.
3. Validate US1 functionality.

### Incremental Delivery

1. Foundation ready (Phase 2 completed).
2. MVP delivered (User Story 1 completed).
3. Add live progress and cancel UI (User Story 2 completed).
4. Add single consolidated file extraction option (User Story 3 completed).
5. Run full validation (Phase 6 completed).
