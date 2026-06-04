# Research: Button Action for Start Extraction

## Decision: Dynamic Injection and Standard Extensions API

For the "Start Extraction" action, we will use dynamic content script injection via `chrome.scripting.executeScript` instead of declaring static content scripts in the manifest. We will query the active tab using `chrome.tabs.query` and download files using `chrome.downloads.download`.

### Rationale

1. **On-Demand Loading**: Static content scripts run on every page matching the manifest filters, which increases browser memory overhead and requires broader host permissions. Dynamic injection via `chrome.scripting.executeScript` only runs when the user explicitly clicks the "Start Extraction" button, aligning with best practices for MV3 extensions.
2. **Tab Access Control**: Dynamic execution uses the `activeTab` permission, which is granted temporarily to the extension upon clicking the browser action. This keeps security scope minimal and respects user privacy.
3. **No External Network Calls**: Standard Chrome extension APIs run entirely inside the browser container, satisfying the client-side execution requirement.

### Alternatives Considered

#### Option A: Static Content Scripts (Declared in manifest.json)
- **Why rejected**: Static content scripts run in the background of matching tabs automatically, injecting code even if the user never uses the extension on that tab. This leaks memory and requires permission to execute script on all URLs permanently.
- **Why dynamic injection is better**: Restricts script execution to only when the user chooses to extract content from the active tab.

#### Option B: Background Script Orchestration
- **Why rejected**: Having the popup talk to the background script, which then talks to the content script, adds extra hops for a simple extraction.
- **Why direct popup execution is better**: The popup script can directly query the active tab and run `chrome.scripting.executeScript` without background worker relays, minimizing lag. If background processing is needed for larger tasks (e.g. ZIP generation), a message can be passed to `background.js`, but the initial click flow starts in the popup.
