# Research Findings: Browser Extension Manifest Configuration

This document outlines the architectural research and decisions made regarding the Chrome Extension Manifest V3 configuration.

## 1. Manifest Specification Version
- **Decision**: Target Manifest Version 3 (MV3) exclusively.
- **Rationale**: Modern Chromium browsers (Chrome, Edge, Brave, Opera) have deprecated Manifest Version 2 (MV2). MV3 improves security, privacy, and performance by substituting persistent background pages with transient service workers and updating APIs.
- **Alternatives Considered**: Manifest Version 2 (MV2).
  - *Why rejected*: MV2 is obsolete and extensions utilizing it are disabled or rejected from public extension stores.

## 2. Scoping Extension Permissions
- **Decision**: Declare `storage`, `activeTab`, and `scripting` permissions with host permissions for all URLs (`<all_urls>`).
- **Rationale**:
  - `storage` is required to save user preferences (single/multi-file mode, character-count limits, similarity thresholds) in accordance with Principle V.
  - `activeTab` allows temporary access to the active tab to execute extraction routines, avoiding permanent broad permissions warning dialogs.
  - `scripting` enables injecting the content script or custom CSS dynamically.
  - `<all_urls>` host permission is needed so content script injection works across all domains, enabling extraction from any site.
- **Alternatives Considered**: General `tabs` permission.
  - *Why rejected*: `tabs` permission provides permanent access to tab URL history, prompting users with invasive security warnings on install.

## 3. Background Scripts Layout
- **Decision**: Register `background.js` as a service worker using the `"background": { "service_worker": "background.js" }` manifest entry.
- **Rationale**: Service workers do not remain memory-resident permanently. The browser spins them down when inactive, saving CPU and RAM.
- **Alternatives Considered**: Persistent background pages.
  - *Why rejected*: Background pages are completely unsupported under the Manifest V3 architecture.

## 4. UI Actions Consolidation
- **Decision**: Define the popup configuration inside the `"action"` object using `"default_popup": "popup/popup.html"`.
- **Rationale**: MV3 unifies `browser_action` and `page_action` APIs under a single `action` configuration key.
- **Alternatives Considered**: `browser_action` or `page_action` specifications.
  - *Why rejected*: These namespaces are obsolete in MV3 and will cause manifest parsing errors.
