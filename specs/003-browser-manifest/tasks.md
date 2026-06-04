# Tasks: Browser Extension Manifest Configuration

**Input**: Design documents from `/specs/003-browser-manifest/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated tests requested in specification. Manual validation follows the quickstart guide.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directories for extension stubs (e.g. `popup/` and `icons/`)
- [x] T002 [P] Configure gitignore file to exclude unnecessary files from final bundle at `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Verify directory structure and permission access at root directory of the workspace

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Extension Installation and Load (Priority: P1) 🎯 MVP

**Goal**: Register standard metadata and permission scoping in `manifest.json`.

**Independent Test**: Load the root directory containing `manifest.json` as an unpacked developer extension in a Chromium browser and verify that no configuration warnings or schema errors are displayed.

### Implementation for User Story 1

- [x] T004 [US1] Create the base `manifest.json` file at `manifest.json` with version, name, and description.
- [x] T005 [US1] Define permissions for storage, activeTab, scripting, and host_permissions for all URLs in `manifest.json`.

**Checkpoint**: At this point, the basic manifest configuration is complete and can be parsed by Chrome.

---

## Phase 4: User Story 2 - Service Worker and Content Scripts Registration (Priority: P2)

**Goal**: Register background scripts and content scripts in the manifest.

**Independent Test**: Service worker runs in the background and the content script loads on page navigation.

### Implementation for User Story 2

- [x] T006 [P] [US2] Create background service worker script stub at `background.js`.
- [x] T007 [P] [US2] Create page content script stub at `content.js`.
- [x] T008 [US2] Update `manifest.json` to register the background service worker `background.js` and content scripts `content.js` matched to `<all_urls>`.

**Checkpoint**: User Stories 1 and 2 are functional together. The background worker and content scripts are active.

---

## Phase 5: User Story 3 - Toolbar Action and Settings Popup (Priority: P3)

**Goal**: Define action popup interface and extension icons configuration in the manifest.

**Independent Test**: Clicking the extension icon launches the settings popup.

### Implementation for User Story 3

- [x] T009 [P] [US3] Create settings popup UI stub at `popup/popup.html`.
- [x] T010 [US3] Update `manifest.json` to register the toolbar action with default popup pointing to `popup/popup.html` and default title.
- [x] T011 [P] [US3] Create placeholder extension icons at `icons/icon16.png`, `icons/icon48.png`, and `icons/icon128.png` and map them in `manifest.json`.

**Checkpoint**: All user stories are independently functional. The user can interact with the popup UI.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T012 [P] Validate final `manifest.json` file structure against schema at `specs/003-browser-manifest/contracts/manifest-schema.json`
- [x] T013 Run quickstart.md validation guide at `specs/003-browser-manifest/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Parallel Opportunities

- Setup tasks T001 and T002 can run in parallel.
- Stubs creation T006 and T007 can run in parallel.
- Popup creation T009 and icon assets creation T011 can run in parallel.
- Stories can be implemented and tested concurrently once the foundational setup is complete.

---

## Parallel Example: User Story 2

```bash
# Launch stub creation for background.js and content.js in parallel:
Task: "Create background service worker script stub at background.js"
Task: "Create page content script stub at content.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently in browser.

### Incremental Delivery

1. Setup + Foundational → Ready
2. Add User Story 1 → Test in browser (MVP!)
3. Add User Story 2 → Test injection and worker activation
4. Add User Story 3 → Test popup UI presentation
