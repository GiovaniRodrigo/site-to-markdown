// State object matching the ExtractionJob data model
const state = {
  tabId: null,
  status: 'idle', // 'idle' | 'extracting' | 'completed' | 'error'
  error: null,
  activeTab: null,
  settings: {
    singleFile: true,
    charLimit: 4000,
    similarityThreshold: 0.85
  }
};

// UI Element references
let extractBtn;
let statusEl;
let errorEl;
let tabTitleEl;
let tabUrlEl;
let modeToggle;
let limitInput;
let limitValue;
let thresholdInput;
let thresholdValue;
let limitGroup;

// Initialize when popup loads
document.addEventListener('DOMContentLoaded', async () => {
  // Select DOM Elements
  extractBtn = document.getElementById('extract-btn');
  statusEl = document.getElementById('status-msg');
  errorEl = document.getElementById('error-banner');
  tabTitleEl = document.getElementById('tab-title-display');
  tabUrlEl = document.getElementById('tab-url-display');
  modeToggle = document.getElementById('mode-toggle');
  limitInput = document.getElementById('limit-input');
  limitValue = document.getElementById('limit-value');
  thresholdInput = document.getElementById('threshold-input');
  thresholdValue = document.getElementById('threshold-value');
  limitGroup = document.getElementById('limit-group');

  // Load settings from storage
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['singleFile', 'charLimit', 'similarityThreshold'], (items) => {
      state.settings.singleFile = items.singleFile !== undefined ? items.singleFile : true;
      state.settings.charLimit = items.charLimit !== undefined ? items.charLimit : 4000;
      state.settings.similarityThreshold = items.similarityThreshold !== undefined ? items.similarityThreshold : 0.85;
      
      updateSettingsUI();
    });
  }

  // Setup Event Listeners
  if (modeToggle) {
    modeToggle.addEventListener('change', (e) => {
      state.settings.singleFile = !e.target.checked;
      saveSettings();
      toggleLimitGroup();
    });
  }

  if (limitInput) {
    limitInput.addEventListener('input', (e) => {
      state.settings.charLimit = parseInt(e.target.value, 10);
      if (limitValue) limitValue.textContent = state.settings.charLimit;
      saveSettings();
    });
  }

  if (thresholdInput) {
    thresholdInput.addEventListener('input', (e) => {
      state.settings.similarityThreshold = parseFloat(e.target.value);
      if (thresholdValue) thresholdValue.textContent = Math.round(state.settings.similarityThreshold * 100) + '%';
      saveSettings();
    });
  }

  if (extractBtn) {
    extractBtn.addEventListener('click', startExtraction);
  }

  // Fetch current active tab and validate
  await checkActiveTab();
  updateUI();
});

// Sync state to form controls
function updateSettingsUI() {
  if (modeToggle) modeToggle.checked = !state.settings.singleFile;
  if (limitInput) {
    limitInput.value = state.settings.charLimit;
    if (limitValue) limitValue.textContent = state.settings.charLimit;
  }
  if (thresholdInput) {
    thresholdInput.value = state.settings.similarityThreshold;
    if (thresholdValue) thresholdValue.textContent = Math.round(state.settings.similarityThreshold * 100) + '%';
  }
  toggleLimitGroup();
}

// Show/hide chunk limit input based on single/multi-file mode
function toggleLimitGroup() {
  if (limitGroup) {
    limitGroup.style.display = state.settings.singleFile ? 'none' : 'flex';
  }
}

// Save settings to Chrome Storage
// For Phase 4 compatibility: does not fail if storage API is unavailable
function saveSettings() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({
      singleFile: state.settings.singleFile,
      charLimit: state.settings.charLimit,
      similarityThreshold: state.settings.similarityThreshold
    });
  }
}

// Verify if active tab can be extracted
async function checkActiveTab() {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    setTabDisplay('Offline / No Tab', 'N/A');
    return;
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      setErrorState('No active tab found.');
      return;
    }

    state.activeTab = tab;
    state.tabId = tab.id;
    setTabDisplay(tab.title, tab.url);

    // Validate URL safety (privileged pages block content script injection)
    const url = tab.url || '';
    const isRestricted = url.startsWith('chrome://') || 
                         url.startsWith('chrome-extension://') || 
                         url.startsWith('edge://') || 
                         url.startsWith('about:') ||
                         url.startsWith('chrome.google.com/webstore') ||
                         url.startsWith('chromewebstore.google.com');

    if (isRestricted) {
      setErrorState('Cannot extract content from browser privileged pages.');
      if (extractBtn) extractBtn.disabled = true;
    }
  } catch (err) {
    setErrorState('Error querying active tab: ' + err.message);
  }
}

function setTabDisplay(title, url) {
  if (tabTitleEl) tabTitleEl.textContent = title || 'Untitled Page';
  if (tabUrlEl) {
    tabUrlEl.textContent = url || 'Unknown URL';
    tabUrlEl.title = url || '';
  }
}

function setErrorState(message) {
  state.status = 'error';
  state.error = message;
  updateUI();
}

// Main logic for Starting Extraction
async function startExtraction() {
  if (!state.tabId || state.status === 'extracting') return;

  state.status = 'extracting';
  state.error = null;
  updateUI();

  try {
    // 1. Inject libraries (readability & turndown)
    await chrome.scripting.executeScript({
      target: { tabId: state.tabId },
      files: ['lib/readability.js', 'lib/turndown.js']
    });

    // 2. Inject content.js
    await chrome.scripting.executeScript({
      target: { tabId: state.tabId },
      files: ['content.js']
    });

    // 3. Send extraction message to tab
    chrome.tabs.sendMessage(state.tabId, {
      action: 'extract_content',
      settings: {
        similarityThreshold: state.settings.similarityThreshold
      }
    }, async (response) => {
      // Handle chrome.runtime.lastError (e.g. tab closed or script injection failed)
      if (chrome.runtime.lastError) {
        setErrorState(chrome.runtime.lastError.message);
        return;
      }

      if (!response || !response.success) {
        setErrorState(response ? response.error : 'Failed to receive response from content script.');
        return;
      }

      try {
        await processAndDownload(response.data);
        state.status = 'completed';
        updateUI();
      } catch (downloadErr) {
        setErrorState('Download error: ' + downloadErr.message);
      }
    });

  } catch (err) {
    setErrorState('Injection failed: ' + err.message);
  }
}

// Format markdown frontmatter metadata and trigger downloads
async function processAndDownload(data) {
  const { title, url, markdown } = data;
  const safeTitle = sanitizeFilename(title);
  const timestamp = new Date().toISOString();

  if (state.settings.singleFile) {
    // Single consolidated Markdown file
    const fileContent = [
      '---',
      `title: ${quoteFrontmatter(title)}`,
      `url: ${url}`,
      `extracted_at: ${timestamp}`,
      'chunk_index: 1',
      'chunk_count: 1',
      '---',
      '',
      markdown
    ].join('\n');

    await triggerDownload(fileContent, `${safeTitle}.md`, 'text/markdown');
  } else {
    // Split mode (Multi-file)
    const chunks = splitMarkdown(markdown, state.settings.charLimit);
    
    if (chunks.length === 0) {
      throw new Error('No content found after splitting.');
    }

    if (chunks.length === 1) {
      // Fallback to single file if only 1 chunk produced
      const fileContent = [
        '---',
        `title: ${quoteFrontmatter(title)}`,
        `url: ${url}`,
        `extracted_at: ${timestamp}`,
        'chunk_index: 1',
        'chunk_count: 1',
        '---',
        '',
        chunks[0]
      ].join('\n');

      await triggerDownload(fileContent, `${safeTitle}.md`, 'text/markdown');
    } else {
      // Build ZIP Archive using JSZip
      if (typeof JSZip === 'undefined') {
        throw new Error('JSZip library is not loaded.');
      }

      const zip = new JSZip();
      chunks.forEach((chunkText, index) => {
        const partNum = index + 1;
        const chunkTitle = `${title} (Part ${partNum} of ${chunks.length})`;
        
        const chunkContent = [
          '---',
          `title: ${quoteFrontmatter(chunkTitle)}`,
          `url: ${url}`,
          `extracted_at: ${timestamp}`,
          `chunk_index: ${partNum}`,
          `chunk_count: ${chunks.length}`,
          '---',
          '',
          chunkText
        ].join('\n');

        zip.file(`${safeTitle}_part${partNum}.md`, chunkContent);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const blobUrl = URL.createObjectURL(zipBlob);
      
      await chrome.downloads.download({
        url: blobUrl,
        filename: `${safeTitle}.zip`,
        saveAs: true
      });

      // Revoke URL after a small delay to avoid memory leak
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    }
  }
}

// Paragraph-preserving splitter logic
function splitMarkdown(markdown, limit) {
  const paragraphs = markdown.split('\n\n');
  const chunks = [];
  let currentChunk = [];
  let currentLength = 0;

  for (let paragraph of paragraphs) {
    const pLength = paragraph.length;

    // If a paragraph is longer than the limit, split it by sentences
    if (pLength > limit) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n\n'));
        currentChunk = [];
        currentLength = 0;
      }
      
      const sentences = paragraph.match(/[^.!?]+[.!?]+(\s|$)/g) || [paragraph];
      let subChunk = [];
      let subLength = 0;

      for (let sentence of sentences) {
        if (subLength + sentence.length > limit) {
          if (subChunk.length > 0) {
            chunks.push(subChunk.join(' '));
            subChunk = [];
            subLength = 0;
          }
        }
        subChunk.push(sentence);
        subLength += sentence.length;
      }
      if (subChunk.length > 0) {
        chunks.push(subChunk.join(' '));
      }
      continue;
    }

    if (currentLength + pLength + 2 > limit) {
      chunks.push(currentChunk.join('\n\n'));
      currentChunk = [paragraph];
      currentLength = pLength;
    } else {
      currentChunk.push(paragraph);
      currentLength += pLength + (currentChunk.length > 1 ? 2 : 0);
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n\n'));
  }

  return chunks;
}

// Download local file content
function triggerDownload(content, filename, mimeType) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([content], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: blobUrl,
      filename: filename,
      saveAs: true
    }, (downloadId) => {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(downloadId);
      }
    });
  });
}

// Sanitize filename to avoid invalid characters
function sanitizeFilename(name) {
  return name
    .replace(/[\\/*?:"<>|]/g, '_') // Replace invalid symbols
    .replace(/\s+/g, '_')          // Replace spaces with underscores
    .substring(0, 80);            // Limit length
}

// Quote strings with quotes or colons for safe YAML frontmatter
function quoteFrontmatter(str) {
  const escaped = str.replace(/"/g, '\\"');
  return `"${escaped}"`;
}

// Update the trigger button and message UI states
function updateUI() {
  if (!extractBtn || !statusEl || !errorEl) return;

  const isRestricted = state.activeTab && (
    state.activeTab.url.startsWith('chrome://') || 
    state.activeTab.url.startsWith('chrome-extension://') || 
    state.activeTab.url.startsWith('edge://') || 
    state.activeTab.url.startsWith('about:') ||
    state.activeTab.url.startsWith('chrome.google.com/webstore') ||
    state.activeTab.url.startsWith('chromewebstore.google.com')
  );

  switch (state.status) {
    case 'idle':
      extractBtn.disabled = isRestricted;
      extractBtn.textContent = 'Start Extraction';
      extractBtn.classList.remove('loading', 'success', 'error-state');
      statusEl.textContent = 'Ready to extract';
      errorEl.style.display = 'none';
      break;

    case 'extracting':
      extractBtn.disabled = true;
      extractBtn.textContent = 'Extracting...';
      extractBtn.classList.add('loading');
      extractBtn.classList.remove('success', 'error-state');
      statusEl.textContent = 'Parsing page content...';
      errorEl.style.display = 'none';
      break;

    case 'completed':
      extractBtn.disabled = isRestricted;
      extractBtn.textContent = 'Success!';
      extractBtn.classList.add('success');
      extractBtn.classList.remove('loading', 'error-state');
      statusEl.textContent = 'Download started successfully.';
      errorEl.style.display = 'none';
      
      setTimeout(() => {
        if (state.status === 'completed') {
          state.status = 'idle';
          updateUI();
        }
      }, 2000);
      break;

    case 'error':
      extractBtn.disabled = isRestricted;
      extractBtn.textContent = 'Try Again';
      extractBtn.classList.add('error-state');
      extractBtn.classList.remove('loading', 'success');
      statusEl.textContent = 'Extraction failed.';
      errorEl.textContent = state.error || 'An unknown error occurred.';
      errorEl.style.display = 'block';
      break;
  }
}
