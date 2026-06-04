# Tasks: Setup README

**Input**: Design documents from `/specs/007-setup-readme/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Tests are NOT requested or required for this documentation-only feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project structure. All source paths are project-relative to the repository root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify and prepare resources needed for the README

- [ ] T001 Verify existence of required assets: public/icons/icon128.png, docs/crawler.md, and docs/extractors.md
- [ ] T002 Verify project configurations in package.json and manifest.json to align with the name "GF Code: Site to Markdown"

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core setup of the root README file

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Initialize the new root README.md file with the initial placeholder structure

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create Bilingual README (Priority: P1) 🎯 MVP

**Goal**: Create a comprehensive, beautiful bilingual README.md in the root directory.

**Independent Test**: Verify README.md existence, correct centered logo, working language switcher, complete English first block, complete Portuguese second block, and valid relative links using the quickstart.md checks.

### Implementation for User Story 1

- [ ] T004 [US1] Create top-level layout in root README.md including the centered logo using public/icons/icon128.png and the language switcher anchors
- [ ] T005 [US1] Implement English section in root README.md covering features, installation, usage, folder structure tree, testing commands, and constitution principles summary
- [ ] T006 [US1] Implement Portuguese section in root README.md containing the localized content matching the English section
- [ ] T007 [US1] Verify all relative links and internal anchors in root README.md using the quickstart.md verification script

**Checkpoint**: At this point, the bilingual README should be fully complete and verified.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final formatting review and quickstart checks

- [ ] T008 Run the full quickstart.md validation script / checks on root README.md
- [ ] T009 Verify markdown file formatting and visual rendering in Markdown preview

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion.
- **Polish (Final Phase)**: Depends on User Story 1 completion.

### Parallel Opportunities

- T001 and T002 can be executed in parallel.
- Writing English section (T005) and Portuguese section (T006) can be done in parallel if worked on by different contributors, though they are in the same file.
