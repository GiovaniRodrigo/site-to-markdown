# Feature Specification: LLM API Integration for Markdown Improvement

**Feature Branch**: `008-llm-api-integration`

**Created**: 2026-06-11

**Status**: Draft

**Input**: User description: "opção de linkar com llm via api para melhorar conteúdo de markdown gerado"

## Clarifications

### Session 2026-06-11

- Q: How should the "RAG for objective" mechanism be implemented and executed within the extension's lightweight, client-side Vanilla architecture? → A: Prompt-Based Context RAG: Provide a text area for the "Objective" in the UI, and pass this objective directly as a system/user instruction alongside the extracted text to the LLM.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure LLM Connection (Priority: P1)

Users want to configure their LLM connection preferences within the extension popup so that the extension can access the model to refine the generated markdown.

**Why this priority**: Without configuring the API access details, no LLM operations can occur. This is the foundation of the feature.

**Independent Test**: Can be tested by opening the popup, accessing the configuration page, filling out connection details (such as API keys/endpoints), and verifying they are stored correctly in extension local storage.

**Acceptance Scenarios**:

1. **Given** the user opens the extension configuration popup, **When** they toggle "Enable LLM Improvements" and input valid configuration details, **Then** the settings are saved and persistent across sessions.
2. **Given** a saved LLM configuration, **When** the user clicks "Test Connection", **Then** the extension sends a lightweight request to the model/endpoint and shows a success checkmark or error message.

---

### User Story 2 - Automated/Manual LLM-Based Content Improvement (Priority: P2)

Users want the extension to process the extracted markdown content using the configured LLM API to clean up formatting issues, remove residual HTML, and optimize the structure for LLM readability.

**Why this priority**: This implements the core value proposition of enhancing the extracted markdown content using an LLM.

**Independent Test**: Can be tested by invoking the extraction flow with mock LLM API responses and validating that the output file contains the improved content instead of the raw extraction.

**Acceptance Scenarios**:

1. **Given** a page with messy layout blocks and navigation noise, **When** the extraction finishes with LLM enhancement active, **Then** the output markdown file is rewritten by the LLM to flow naturally with cohesive headers and formatting.
2. **Given** that the LLM request is processing, **When** the user looks at the popup, **Then** a progress indicator or loading state is displayed so the user knows the LLM is working.

---

### User Story 3 - Visual Comparison of Original vs. Improved Content (Priority: P3)

Users want to see a side-by-side or tabbed preview of the original extracted markdown and the LLM-improved markdown before downloading the file.

**Why this priority**: While highly valuable for user confidence and control, it is a non-blocking UI enhancement.

**Independent Test**: Can be tested by opening the preview tab after extraction and switching between the "Original" and "LLM Improved" tabs to verify differential content display.

**Acceptance Scenarios**:

1. **Given** an LLM refinement has completed successfully, **When** the user views the preview window, **Then** they can toggle between the "Original Markdown" and "Improved Markdown" previews.

---

### Edge Cases

- **Large File Token Overflow**: The extracted markdown exceeds the context window of the configured LLM. The system should chunk the content safely or warn the user.
- **Connection Failures/Timeouts**: The LLM API is unreachable, times out, or returns a rate-limit error. The system must notify the user and fall back to downloading the original unimproved markdown.
- **Missing API Keys**: The user enables LLM improvement but has not provided a valid key or endpoint. The system must prompt them to configure it rather than failing silently.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The popup UI MUST provide a toggle switch to enable or disable LLM-assisted markdown improvement.
- **FR-002**: The extension MUST securely store LLM configuration parameters (API key, selected model, custom endpoint) using the browser's local storage API.
- **FR-003**: The system MUST support connection types: external cloud APIs (e.g., Gemini API, OpenAI API) with user-provided keys, displaying a clear privacy notice/warning in the popup UI.
- **FR-004**: The system MUST support specific LLM providers: broad standard providers (OpenAI, Gemini, Anthropic Claude) and Ollama for local models.
- **FR-005**: The improvement trigger MUST be: either automatically on extraction (if "Auto-refine" is toggled on in settings) or triggered manually by clicking a "Refine with LLM" button in the preview pane.
- **FR-006**: When processing is active, the UI MUST display a loading spinner indicating that LLM refinement is in progress.
- **FR-007**: If the LLM API request fails (e.g., status code 4xx/5xx or timeout), the extension MUST display a user-friendly warning message and fallback to the original markdown to prevent data loss.
- **FR-008**: The popup UI MUST provide a text area for the user to define their optional improvement "Objective" (e.g., "summarize key points", "extract recipes only").
- **FR-009**: When an objective is provided, the system MUST include it in the LLM prompt to guide context retrieval and instruction alignment during refinement.

### Key Entities *(include if feature involves data)*

- **LLMConfig**: Configuration object containing provider type, API key, model identifier, custom API base URL, temperature, and prompt template.
- **ExtractionSession**: State object tracking original markdown content, improved markdown content, LLM API response status, and processing state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can enable, configure, and successfully test an LLM connection in under 1 minute.
- **SC-002**: When LLM improvement is active and successful, the downloaded file contains the improved markdown instead of the raw DOM-extracted markdown.
- **SC-003**: If the LLM call fails, the download falls back to raw markdown in under 2 seconds, ensuring no user block.
- **SC-004**: All LLM processing is performed locally or directly from the client's browser (no centralized extension server proxy), adhering to the local-client constraint.

## Assumptions

- The user has access to either an internet connection (for cloud LLMs) or a running local model server (for local LLMs).
- The default prompt template used by the extension is sufficient for general website clean-up (headers, structural flow, noise removal) without requiring user customization in version 1.
- Cloud API keys will be stored locally in the browser's storage and sent directly from the browser context to the provider's API.
