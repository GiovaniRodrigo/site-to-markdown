# Tasks: LLM API Integration for Markdown Improvement

**Input**: Design documents from `/specs/008-llm-api-integration/`

**Prerequisites**: [plan.md](file:///home/giovani/Documents/projects/site-markdown/specs/008-llm-api-integration/plan.md), [spec.md](file:///home/giovani/Documents/projects/site-markdown/specs/008-llm-api-integration/spec.md), [research.md](file:///home/giovani/Documents/projects/site-markdown/specs/008-llm-api-integration/research.md), [data-model.md](file:///home/giovani/Documents/projects/site-markdown/specs/008-llm-api-integration/data-model.md), [contracts/messages.md](file:///home/giovani/Documents/projects/site-markdown/specs/008-llm-api-integration/contracts/messages.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths reference the single project structure: `background.js`, `manifest.json`, and components under `popup/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project verification and baseline alignment.

- [x] T001 Verify extension dependencies and testing frameworks in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extension routing interfaces and persistent keys schema setup.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Configure message listener routing signatures in `background.js`
- [x] T003 Define initial settings storage keys schema inside `popup/popup.js`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Configure LLM Connection (Priority: P1) 🎯 MVP

**Goal**: Allow users to toggle LLM features, configure keys, endpoints, and run connection checks.

**Independent Test**: Put configurations into the settings sub-panel, click "Test Connection", see checkmark or error, verify storage.

### Implementation for User Story 1

- [x] T004 [P] [US1] Add LLM Configuration HTML UI inputs and warning blocks to `popup/popup.html`
- [x] T005 [P] [US1] Implement LLM Configuration styling and active states in `popup/popup.css`
- [x] T006 [US1] Implement settings load/save local storage logic in `popup/popup.js`
- [x] T007 [P] [US1] Implement `testLLMConnection` receiver and direct endpoint HTTP ping handlers in `background.js`
- [x] T008 [US1] Implement "Test Connection" button event handling and visual feedback in `popup/popup.js`
- [x] T009 [P] [US1] Implement unit tests for storage config and fetch builders in `tests/llm-config.test.js`

**Checkpoint**: User Story 1 configuration flow is fully functional and testable independently.

---

## Phase 4: User Story 2 - Automated/Manual LLM-Based Content Improvement (Priority: P2)

**Goal**: Request background worker execution of prompts to optimize extracted markdown content.

**Independent Test**: Run extraction, see spinner, click manual improve or wait for auto-refine, check output contents.

### Implementation for User Story 2

- [x] T010 [P] [US2] Implement `improveMarkdown` request handler in `background.js` to build prompt and fetch refined content from active provider
- [x] T011 [US2] Implement auto-refine trigger in extraction flow in `popup/popup.js`
- [x] T012 [US2] Implement "Refine with LLM" manual trigger button and spinner logic in `popup/popup.js`
- [x] T013 [P] [US2] Write Vitest unit tests for prompt formatting and response parsers for Gemini/OpenAI/Ollama in `tests/llm-requests.test.js`

**Checkpoint**: Extraction flows integrate LLM refinement.

---

## Phase 5: User Story 3 - Visual Comparison of Original vs. Improved Content (Priority: P3)

**Goal**: Tabbed preview window letting users check original vs. refined markdown.

**Independent Test**: Extract markdown and toggle preview tabs to verify distinct displays.

### Implementation for User Story 3

- [x] T014 [P] [US3] Add Original vs. Improved tab switches in the preview container of `popup/popup.html`
- [x] T015 [P] [US3] Update `popup/popup.css` for tab styling and transition layout
- [x] T016 [US3] Implement tab switching logic and dynamic display updates in `popup/popup.js`

**Checkpoint**: Preview tabs are functional.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Bounds check warnings, fallbacks, and documentation.

- [x] T017 [P] Implement context length character warning dialog in `popup/popup.js`
- [x] T018 [P] Implement direct fallback to raw markdown on API errors/timeouts in `background.js`
- [x] T019 Run validation scenario steps in `specs/008-llm-api-integration/quickstart.md` to ensure correct MV3 end-to-end operation
- [x] T020 Document user configuration guide in `README.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently.

### Incremental Delivery

1. Complete Setup + Foundational -> Foundation ready
2. Add User Story 1 -> Test -> Deploy (MVP!)
3. Add User Story 2 -> Test
4. Add User Story 3 -> Test
