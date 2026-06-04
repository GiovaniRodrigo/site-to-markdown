# Feature Specification: Test Suite Validation Framework

**Feature Branch**: `001-test-suite-validation`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "teste de código validando cobertura, DRY, e e2e"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unit & Integration Testing with Coverage Gates (Priority: P1)

As a developer, I want to run a fast, local unit and integration test suite to verify the logic of the extension's core modules (extraction, deduplication, formatting, and packaging) and enforce a strict test coverage gate of at least 80% to ensure code changes are well-tested.

**Why this priority**: Core logic is the foundation of the browser extension. Checking this fast and locally prevents regression bugs.

**Independent Test**: The test suite can be run standalone, outputting statement, branch, line, and function coverage. If any metric is under 80%, the execution must exit with code 1.

**Acceptance Scenarios**:

1. **Given** a set of Javascript modules with unit tests, **When** the developer runs the test command and coverage is >=80%, **Then** the tests pass and the runner exits with code 0.
2. **Given** a set of Javascript modules, **When** the developer runs the test command and any coverage metric (lines, functions, statements, branches) is <80%, **Then** the test coverage fails, details are displayed, and the runner exits with code 1.

---

### User Story 2 - DRY Code Quality Enforcement (Priority: P2)

As a developer, I want to execute an automated code duplication analyzer to detect duplicate blocks of code, ensuring that the codebase conforms to the Don't Repeat Yourself (DRY) principle.

**Why this priority**: Preventing code duplication keeps the code clean, modular, and easy to maintain.

**Independent Test**: Running the DRY check tool alone on the source code. If code duplication exceeds 5% or an individual duplicated block contains 50+ tokens, it must exit with code 1.

**Acceptance Scenarios**:

1. **Given** source files with less than 5% duplication, **When** the DRY check command is executed, **Then** the check passes and the tool exits with code 0.
2. **Given** source files containing duplicate code blocks that exceed 5% total duplication or contain a duplicate of 50+ tokens, **When** the DRY check command is executed, **Then** the duplicate locations are reported and the tool exits with code 1.

---

### User Story 3 - End-to-End (E2E) Browser Extension Testing (Priority: P3)

As a developer, I want to run E2E browser tests that launch Chromium with the extension pre-loaded, open a mock web page, open the extension popup UI, set options, click extraction, and verify that the correct files are downloaded.

**Why this priority**: It validates the complete extension execution flow (extension injection, popup rendering, messaging, DOM reading, and file download) in a real browser environment.

**Independent Test**: Execute the E2E command. It should launch Chromium in headless/headed mode via Playwright, execute browser actions, download the output, and assert its correctness.

**Acceptance Scenarios**:

1. **Given** the extension popup and content script, **When** Playwright executes the test flow on a dummy page, **Then** the page text is successfully extracted, deduplicated, formatted, and downloaded as a ZIP or MD file matching the mock assertions.

---

### Edge Cases

- **CI/CD Headless Environment**: Running E2E tests in standard Docker/Linux environments without a display server. Playwright must be configured to run in headless mode or use a virtual framebuffer (e.g. xvfb) to execute cleanly.
- **Third-Party Libraries**: Third-party libraries like Readability.js, Turndown.js, or JSZip must be excluded from coverage and DRY calculations so they do not trigger false duplication or low-coverage alerts.
- **Test Files Exclusion**: Test files themselves must be excluded from DRY (code duplication) checking to avoid flagging repeated test patterns as code duplication.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST use Vitest with JSDOM environment for running unit and integration tests.
- **FR-002**: The system MUST use Playwright for running end-to-end extension tests in Chromium.
- **FR-003**: The system MUST use `jscpd` for checking code duplication (DRY validation).
- **FR-004**: The system MUST use Vitest's coverage tool (with v8 provider) to calculate and enforce statement, branch, line, and function coverage thresholds.
- **FR-005**: The system MUST provide a single unified script command (e.g. `npm test` or `npm run test:all`) that runs the DRY check, the unit tests with coverage, and the E2E tests sequentially.
- **FR-006**: The system MUST fail the unified validation execution (exit code 1) if any individual step (DRY check, unit test, coverage threshold, or E2E test) fails.
- **FR-007**: The system MUST allow exclusion configurations for third-party scripts, configurations, and test files in DRY and coverage tools.

### Key Entities *(include if feature involves data)*

- **Validation Runner**: The master script/command that runs quality and functional verification steps sequentially.
- **jscpd Duplication Rules**: Configuration file (`.jscpd.json`) containing token limits, duplication percentage thresholds, and directory exclusions.
- **Vitest Coverage Config**: Configuration in `vitest.config.js` defining the `coverage` block, thresholds (statements, branches, lines, functions >= 80), and exclusions.
- **Playwright Test Config**: Configuration in `playwright.config.js` that sets up the path to the extension build and mock pages for E2E scenarios.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The entire test suite (DRY check + unit tests + coverage check + E2E browser tests) MUST complete in under 60 seconds on a standard developer workstation.
- **SC-002**: Code coverage statement, branch, line, and function metrics MUST be at or above 80% for all developed javascript source files.
- **SC-003**: Code duplication percentage reported by `jscpd` MUST be under 5% across the project source code.
- **SC-004**: Any violation of test coverage thresholds, code duplication limits, or functional tests MUST result in a non-zero exit code of the unified test command.

## Assumptions

- Developers and CI environments have Node.js (v18+) and npm installed.
- All E2E tests run using Playwright's Chromium driver, which is sufficient for validating Chrome Extension APIs.
- Third-party library files (Readability.js, Turndown.js, JSZip) are stored in a designated vendor/libs folder and excluded from quality audits.
