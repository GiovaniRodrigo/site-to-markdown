# Feature Specification: Button Action for Start Extraction

**Feature Branch**: `004-start-extraction-button`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "button action for start extraction"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trigger Extraction and Download (Priority: P1)

The user wants to click a button in the browser action popup to extract clean markdown from the active browser tab and download it immediately.

**Why this priority**: This is the core functionality of the extension, enabling the user to convert pages with a single click.

**Independent Test**: The user opens a web page, opens the extension popup, and clicks the extraction button. A file download dialog appears for the extracted markdown file.

**Acceptance Scenarios**:

1. **Given** the user is viewing a standard web page, **When** they open the popup and click "Start Extraction", **Then** the content script is injected and executes, and the resulting markdown file is downloaded.
2. **Given** the user is on a restricted browser page (e.g., chrome://settings), **When** they open the popup, **Then** the "Start Extraction" button is disabled or displays a message explaining that extraction is not allowed on this page.

---

### User Story 2 - User Feedback and Loading States (Priority: P2)

The user wants to see a visual indication that the extraction process is active, preventing them from double-clicking or assuming the extension has crashed.

**Why this priority**: Enhances the user experience and prevents race conditions from multiple clicks.

**Independent Test**: The user starts the extraction on a large page and observes the button change to a loading state.

**Acceptance Scenarios**:

1. **Given** an extraction is in progress, **When** the user looks at the popup, **Then** the button text changes to "Extracting...", a spinner is displayed, and the button is disabled.
2. **Given** the extraction finishes, **When** the download is initiated, **Then** the button resets to its default active state.

---

### User Story 3 - Error Handling and User Notification (Priority: P3)

The user wants to know if something goes wrong during extraction, so they understand why a file was not downloaded.

**Why this priority**: Helps diagnostic and troubleshooting, improving overall user satisfaction.

**Independent Test**: The user runs extraction on a page where content script injection fails and sees a clear error message.

**Acceptance Scenarios**:

1. **Given** the content script fails to load or execute, **When** the user clicks "Start Extraction", **Then** the popup displays a readable error message describing the failure.

---

### Edge Cases

- **Rapid Multiple Clicks**: If the user double-clicks the button, only the first action should trigger; subsequent clicks during active extraction must be ignored or disabled.
- **Unresponsive Tab**: If the content script does not reply within a timeout period (e.g. 5 seconds), the popup should stop the loading state and display a timeout error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The extension popup MUST display a prominent action button to start content extraction.
- **FR-002**: Clicking the extraction button MUST trigger the injection and execution of the extraction script (`content.js`) on the active tab using the browser `scripting` API.
- **FR-003**: The popup MUST display a visual progress indicator (e.g. spinner, loading text, and disabled state) while extraction, post-processing, and file generation are in progress.
- **FR-004**: Once the content is successfully extracted and formatted, the system MUST initiate the file download (single file or ZIP archive depending on multi-file configuration).
- **FR-005**: If the extraction fails (due to permission errors, scripting errors, or tab timeout), the popup MUST display a user-friendly error message.

### Key Entities *(include if feature involves data)*

- **Extraction Job**: Represents the active extraction task. Key attributes include: status (idle, extracting, downloading, error), target tab ID, and settings used (single/multi-file, similarity threshold).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clicking the button triggers the content script injection within 100ms.
- **SC-002**: The download dialog is triggered automatically within 2 seconds of completing content extraction.
- **SC-003**: 100% of extraction failures display a user-facing error message within 500ms of failure detection.

## Assumptions

- The active tab contains a standard web page that can be scripted (non-privileged page).
- The user settings are read from `chrome.storage` prior to starting the extraction.
- Standard Web Extension APIs (`chrome.tabs`, `chrome.scripting`, `chrome.downloads`) are supported by the browser.
