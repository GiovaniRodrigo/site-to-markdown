# Tasks: Extractor Inheritance Framework

**Input**: Design documents from `/specs/002-behavior-inheritance/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Unit tests are required using Vitest and will be written first according to TDD principles.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths shown below assume single project root under `src/` and `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize the extractor directory structure under `src/extractors/` and `tests/extractors/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Configure Vitest environment and dependencies in `vitest.config.js` to support Readability and Turndown testing

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Base Extractor Pipeline (Priority: P1) 🎯 MVP

**Goal**: Implement the BaseExtractor class with the template extraction pipeline method calling sequential lifecycle hooks.

**Independent Test**: Run Vitest on `tests/extractors/BaseExtractor.test.js`.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T003 [US1] Create unit tests for BaseExtractor pipeline execution order and defaults in `tests/extractors/BaseExtractor.test.js`

### Implementation for User Story 1

- [x] T004 [US1] Implement BaseExtractor class with template method `extract()` and default hook behaviors in `src/extractors/BaseExtractor.js`
- [x] T005 [US1] Verify BaseExtractor tests pass by running `npx vitest tests/extractors/BaseExtractor.test.js`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Site-Specific Extractor Specialization (Priority: P2)

**Goal**: Implement specialized extractor subclasses (GenericExtractor and WikipediaExtractor) that inherit from BaseExtractor and override specific hooks.

**Independent Test**: Run Vitest on `tests/extractors/WikipediaExtractor.test.js` and `tests/extractors/GenericExtractor.test.js`.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T006 [US2] Create unit tests for GenericExtractor default behavior and WikipediaExtractor custom hooks in `tests/extractors/WikipediaExtractor.test.js` and `tests/extractors/GenericExtractor.test.js`

### Implementation for User Story 2

- [x] T007 [P] [US2] Implement GenericExtractor class extending BaseExtractor in `src/extractors/GenericExtractor.js`
- [x] T008 [P] [US2] Implement WikipediaExtractor class extending BaseExtractor with custom DOM cleaning hooks in `src/extractors/WikipediaExtractor.js`
- [x] T009 [US2] Verify specialized extractors pass tests by running `npx vitest tests/extractors/WikipediaExtractor.test.js` and `tests/extractors/GenericExtractor.test.js`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Extractor Registry & Resolution (Priority: P3)

**Goal**: Implement ExtractorRegistry to map hostnames to specialized extractors with wildcard support.

**Independent Test**: Run Vitest on `tests/extractors/ExtractorRegistry.test.js`.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T010 [US3] Create unit tests for hostname pattern-matching logic and fallback resolution in `tests/extractors/ExtractorRegistry.test.js`

### Implementation for User Story 3

- [x] T011 [US3] Implement ExtractorRegistry class with pattern matching and resolution algorithms in `src/extractors/ExtractorRegistry.js`
- [x] T012 [US3] Verify registry resolution passes tests by running `npx vitest tests/extractors/ExtractorRegistry.test.js`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T013 Run full validation suite via `npm run test` or unified script command
- [x] T014 Document extractor inheritance usage in `docs/extractors.md` or `README.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after User Story 1 (Phase 3) - Inherits from BaseExtractor
- **User Story 3 (P3)**: Can start after User Story 2 (Phase 4) - Resolves subclasses of BaseExtractor

---

## Parallel Opportunities

- The implementation of `GenericExtractor` (`src/extractors/GenericExtractor.js`) and `WikipediaExtractor` (`src/extractors/WikipediaExtractor.js`) can run in parallel (T007 and T008) since they are independent files.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently
5. Each story adds value without breaking previous stories
