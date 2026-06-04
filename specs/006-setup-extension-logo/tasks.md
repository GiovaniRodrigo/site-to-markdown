# Tasks: Setup Extension Logo

**Input**: Design documents from `/specs/006-setup-extension-logo/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: N/A (Manual browser load verification only)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- All paths are relative to the repository root directory.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create directory public/icons/ at the project root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Verify existence of source file GF_Markdown_Extractor.ico in the project root

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Extract and Configure Logo Icons (Priority: P1) 🎯 MVP

**Goal**: Extract and save new PNG icons under `public/icons/` and link them in the manifest.

**Independent Test**: Verify icons exist in `public/icons/` at correct resolutions and `manifest.json` points to them.

### Implementation for User Story 1

- [x] T003 [P] [US1] Extract 16x16 icon from GF_Markdown_Extractor.ico[0] to public/icons/icon16.png using convert
- [x] T004 [P] [US1] Extract 32x32 icon from GF_Markdown_Extractor.ico[1] to public/icons/icon32.png using convert
- [x] T005 [P] [US1] Extract 48x48 icon from GF_Markdown_Extractor.ico[2] to public/icons/icon48.png using convert
- [x] T006 [P] [US1] Extract 128x128 icon from GF_Markdown_Extractor.ico[4] to public/icons/icon128.png using convert
- [x] T007 [US1] Update icons paths configuration in manifest.json

**Checkpoint**: At this point, the new icons should be fully configured and functional.

---

## Phase 4: User Story 2 - Old Assets Cleanup (Priority: P2)

**Goal**: Delete the legacy `icons/` folder and clean up the workspace.

**Independent Test**: Check that `icons/` directory is no longer present.

### Implementation for User Story 2

- [x] T008 [US2] Delete old directory icons/ and its contents

**Checkpoint**: At this point, the repository layout is clean.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validation and final verification

- [x] T009 Run quickstart verification scenarios in specs/006-setup-extension-logo/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2).
- **User Story 2 (P2)**: Can start after User Story 1 (P1) is configured.

### Parallel Opportunities

- Extraction tasks (T003, T004, T005, T006) can run in parallel as they operate on different output files.

---

## Parallel Example: User Story 1

```bash
# Extract icons in parallel using background processes or separate commands
convert GF_Markdown_Extractor.ico[0] public/icons/icon16.png &
convert GF_Markdown_Extractor.ico[1] public/icons/icon32.png &
convert GF_Markdown_Extractor.ico[2] public/icons/icon48.png &
convert GF_Markdown_Extractor.ico[4] public/icons/icon128.png &
wait
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002)
3. Complete Phase 3: User Story 1 (T003 to T007)
4. **STOP and VALIDATE**: Verify that icons are correctly loaded by Chrome extension.
5. Proceed to cleanup (T008) and final verification (T009).
