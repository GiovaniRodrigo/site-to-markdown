# Tasks: Button Action for Start Extraction

**Input**: Design documents from `/specs/004-start-extraction-button/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - none were explicitly requested in the specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths assume standard extension layout at repository root (`popup/`, `content.js`, `manifest.json`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and validation of the manifest configuration.

- [x] T001 Verify `manifest.json` contains required permissions (`activeTab`, `scripting`, `downloads`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Basic stubs and configuration mapping that block all user stories.

- [x] T002 Initialize empty `popup/popup.js` script with structured state tracking per data model
- [x] T003 Ensure `popup/popup.html` references the local stylesheet and script file

---

## Phase 3: User Story 1 - Trigger Extraction and Download (Priority: P1) 🎯 MVP

**Goal**: Click button in popup to trigger content script extraction and download the resulting file.

**Independent Test**: Scenario 1 in `quickstart.md`.

### Implementation for User Story 1

- [x] T004 [P] [US1] Create extraction trigger button and download result container in `popup/popup.html`
- [x] T005 [P] [US1] Implement DOM selection and messaging receiver in `content.js` to parse page layout and return it
- [x] T006 [US1] Implement event listener and injection logic in `popup/popup.js` using `chrome.scripting.executeScript`
- [x] T007 [US1] Implement file downloader trigger in `popup/popup.js` using `chrome.downloads.download`

---

## Phase 4: User Story 2 - User Feedback and Loading States (Priority: P2)

**Goal**: Show progress/loading indicator and disable double-clicking when extraction is in progress.

**Independent Test**: Scenario 2 in `quickstart.md`.

### Implementation for User Story 2

- [x] T008 [P] [US2] Style loading indicators, spinner, and disabled states in `popup/popup.css`
- [x] T009 [US2] Implement state transitions and UI updates (disabling the button, updating button text, showing spinner) in `popup/popup.js`
- [x] T010 [US2] Integrate resetting logic in `popup/popup.js` to restore the button to its active state when download is initiated

---

## Phase 5: User Story 3 - Error Handling and User Notification (Priority: P3)

**Goal**: Display clear user-facing error messages on restricted/privileged pages or if injection fails.

**Independent Test**: Scenario 3 in `quickstart.md`.

### Implementation for User Story 3

- [x] T011 [P] [US3] Create error banner element in `popup/popup.html` and style it in `popup/popup.css`
- [x] T012 [US3] Implement URL safety check and error catching logic in `popup/popup.js` to disable extraction on privileged pages (e.g., chrome://) and handle runtime errors

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final formatting, cleaning, and manual run verification.

- [x] T013 Run Vitest suite via `npm run test` to verify no regressions in existing extractors
- [x] T014 Run validation scenarios defined in `quickstart.md`
- [x] T015 Perform code cleanup, linting, and remove console logging in `popup/popup.js` and `content.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
  - US1 (MVP) -> US2 -> US3
- **Polish (Final Phase)**: Depends on all user stories completion.

### Parallel Opportunities

- T004 and T005 in US1 can be implemented in parallel.
- T008 and T009 in US2 can be implemented in parallel.
- T011 in US3 can be implemented in parallel.
