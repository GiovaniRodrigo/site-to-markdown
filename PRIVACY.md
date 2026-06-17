# Privacy Policy

Your privacy is extremely important to us. This privacy policy explains how the **GF Code: Site to Markdown** browser extension collects, uses, and protects your information.

---

### 1. Data Collection and General Privacy
* **Fully Client-Side Execution:** The **GF Code: Site to Markdown** extension is designed to run entirely on the client side. We **do not collect**, store, or transmit any personal data, browsing history, or page content to external servers managed by the developers.
* **No Tracking or Analytics:** We do not use cookies, analytics tools, telemetry, or third-party tracking services.

### 2. Content Processing and Conversion
* The entire process of page content extraction (`@mozilla/readability`), markdown conversion (`turndown`), character similarity calculation for deduplication, and ZIP compression runs locally on your machine, within your browser's execution sandbox.

### 3. Optional LLM API Integration (Artificial Intelligence)
The extension offers an optional feature to refine Markdown content using Large Language Models (LLMs). If you choose to enable this feature:
* **API Key Storage:** Your Google Gemini, OpenAI, or Anthropic Claude API keys are stored securely and locally inside your browser (`chrome.storage.local`). They are never shared with or sent to the developers of the extension.
* **Direct Communication with Providers:** When requesting a markdown refinement, the extension sends the extracted content directly from your browser to the chosen provider's endpoint (Google, OpenAI, or Anthropic) using your configured credentials. This communication is governed by the terms of service and privacy policy of the respective API provider.
* **100% Offline Processing (Ollama):** If you use **Ollama**, all AI processing runs locally on your own computer (`http://localhost:11434`), ensuring no data leaves your local network.

### 4. Explanation of Permissions Requested
To function correctly, the extension requires the following browser permissions:
* **`storage`:** Used exclusively to persist your user settings, such as character limits, similarity thresholds, and local API keys.
* **`activeTab` and `scripting`:** Used to read the HTML of the active tab and extract its content when you run an extraction.
* **`downloads`:** Used to trigger browser downloads of the generated Markdown files or ZIP packages to your local system.
* **`<all_urls>`:** Required to support directory crawling across target domains and to perform direct API fetch requests from the background service worker.

### 5. Changes to This Policy
We may update our Privacy Policy from time to time. Any changes will be updated directly in this file or within the official project repository.
