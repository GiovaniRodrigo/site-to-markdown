# Feature Specification: Setup Extension Logo

**Feature Branch**: `006-setup-extension-logo`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "uma dessas imagens deve ser a logo da extensão @[ChatGPT Image 4 de jun. de 2026, 12_13_41.png] @[ChatGPT Image 4 de jun. de 2026, 12_16_06.png] @[GF_Markdown_Extractor.ico]"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Extract and Configure Logo Icons (Priority: P1)

The extension developer wants the extension logo to be properly configured with high-quality icons of standard dimensions (16x16, 32x32, 48x48, 128x128) extracted from `GF_Markdown_Extractor.ico` and saved in `public/icons/` so that the extension displays the correct logo across all browser locations.

**Why this priority**: Essential for brand identity and extension installation/store requirements.

**Independent Test**: Can be fully tested by verifying the existence, dimensions, and path configuration of the icons under `public/icons/`, and loading the extension in a Chromium-based browser to confirm it displays correctly.

**Acceptance Scenarios**:

1. **Given** the source file `GF_Markdown_Extractor.ico` exists in the project root, **When** the logo extraction process is complete, **Then** four PNG files (`icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`) are created in `public/icons/` with the exact respective dimensions.
2. **Given** the new icons are generated, **When** we inspect the files, **Then** they must match the visual content of `GF_Markdown_Extractor.ico` at those specific resolutions.
3. **Given** the new icons are generated, **When** `manifest.json` is updated, **Then** the `"icons"` property maps the keys `"16"`, `"32"`, `"48"`, and `"128"` to their new paths under `public/icons/`.

---

### User Story 2 - Old Assets Cleanup (Priority: P2)

Clean up the repository by deleting the outdated `icons/` directory.

**Why this priority**: Keeps the codebase clean and avoids duplicate/unused assets.

**Independent Test**: Check that `icons/` directory no longer exists in the project workspace.

**Acceptance Scenarios**:

1. **Given** the new icons are configured and verified in `public/icons/`, **When** the cleanup process runs, **Then** the directory `icons/` is permanently removed from the project.

---

### Edge Cases

- **Missing Output Directory**: If the target directory `public/icons/` does not exist, the setup script must automatically create it before writing the PNG files.
- **Source Layer Missing**: If one of the required dimensions is missing in the ICO, the tool should scale down the next largest available dimension (though we have verified that `GF_Markdown_Extractor.ico` contains layers for 16, 32, 48, 64, 128, and 256).
- **Valid manifest.json**: The updated `manifest.json` must be valid JSON and load into Chrome/Edge developer mode without warnings or errors.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST extract/generate PNG images for the following resolutions: 16x16, 32x32, 48x48, and 128x128 pixels from the source file `GF_Markdown_Extractor.ico`.
- **FR-002**: The generated PNG images MUST be stored in the directory `public/icons/` relative to the project root.
- **FR-003**: The file names of the generated PNG images MUST be `icon16.png`, `icon32.png`, `icon48.png`, and `icon128.png`.
- **FR-004**: The project's `manifest.json` MUST be updated to point to the new icon paths: `"16": "public/icons/icon16.png"`, `"32": "public/icons/icon32.png"`, `"48": "public/icons/icon48.png"`, and `"128": "public/icons/icon128.png"`.
- **FR-005**: The old `icons/` directory (containing `icon16.png`, `icon48.png`, `icon128.png`) MUST be deleted from the repository.

### Key Entities *(include if feature involves data)*

- **Icon Configuration**: Represents the mapping of icon dimensions to their respective file paths in the extension manifest.
- **Source Asset**: The raw `GF_Markdown_Extractor.ico` file containing multi-resolution icon assets.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Chrome extension loads in developer mode without any warnings or errors regarding missing or misconfigured icons.
- **SC-002**: The extension logo is visible in the Chrome toolbar, extensions manager (`chrome://extensions`), and details view.
- **SC-003**: Old assets under `icons/` are completely removed, and no references to them remain in the codebase.

## Assumptions

- The source file `GF_Markdown_Extractor.ico` is valid and contains high-quality images for 16x16, 32x32, 48x48, and 128x128 pixels.
- The browser extension platform is Chromium-based (Manifest V3 compatible).
- ImageMagick (`convert`) or Python with PIL can be used during task execution to perform the extraction.