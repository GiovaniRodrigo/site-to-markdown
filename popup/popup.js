// State object matching the ExtractionJob data model
const state = {
  tabId: null,
  status: 'idle', // 'idle' | 'extracting' | 'completed' | 'error' | 'crawling'
  error: null,
  activeTab: null,
  settings: {
    singleFile: true,
    charLimit: 4000,
    similarityThreshold: 0.85
  },
  crawler: {
    urls: [],
    currentIndex: 0,
    results: [],
    abortController: null
  }
};

// UI Element references
let extractBtn;
let scanBtn;
let cancelBtn;
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
  scanBtn = document.getElementById('scan-btn');
  cancelBtn = document.getElementById('cancel-btn');
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

  if (scanBtn) {
    scanBtn.addEventListener('click', startDirectoryScan);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', cancelDirectoryScan);
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

function toggleLimitGroup() {
  if (limitGroup) {
    limitGroup.style.display = state.settings.singleFile ? 'none' : 'flex';
  }
}

// Save settings to Chrome Storage
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
      if (scanBtn) scanBtn.disabled = true;
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

    // If a single paragraph is longer than the limit, split it by sentences or lines
    if (pLength > limit) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n\n'));
        currentChunk = [];
        currentLength = 0;
      }
      
      // Split paragraph by sentences (approximate)
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
      // Revoke the URL object
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
      if (scanBtn) {
        scanBtn.disabled = isRestricted;
        scanBtn.textContent = 'Scan Directory';
        scanBtn.classList.remove('loading', 'success', 'error-state');
      }
      if (cancelBtn) cancelBtn.style.display = 'none';
      statusEl.textContent = 'Ready to extract';
      errorEl.style.display = 'none';
      break;

    case 'extracting':
      extractBtn.disabled = true;
      extractBtn.textContent = 'Extracting...';
      extractBtn.classList.add('loading');
      extractBtn.classList.remove('success', 'error-state');
      if (scanBtn) scanBtn.disabled = true;
      if (cancelBtn) cancelBtn.style.display = 'none';
      statusEl.textContent = 'Parsing page content...';
      errorEl.style.display = 'none';
      break;

    case 'crawling':
      extractBtn.disabled = true;
      if (scanBtn) {
        scanBtn.disabled = true;
        scanBtn.textContent = 'Scanning...';
        scanBtn.classList.add('loading');
      }
      if (cancelBtn) cancelBtn.style.display = 'inline-block';
      if (state.crawler.urls.length > 0) {
        statusEl.textContent = `Crawled ${state.crawler.currentIndex} of ${state.crawler.urls.length} pages...`;
      } else {
        statusEl.textContent = 'Extracting links...';
      }
      errorEl.style.display = 'none';
      break;

    case 'completed':
      extractBtn.disabled = isRestricted;
      extractBtn.textContent = 'Success!';
      extractBtn.classList.add('success');
      extractBtn.classList.remove('loading', 'error-state');
      if (scanBtn) {
        scanBtn.disabled = isRestricted;
        scanBtn.textContent = 'Success!';
        scanBtn.classList.add('success');
        scanBtn.classList.remove('loading', 'error-state');
      }
      if (cancelBtn) cancelBtn.style.display = 'none';
      statusEl.textContent = 'Download started successfully.';
      errorEl.style.display = 'none';
      
      // Auto-reset after a short delay
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
      if (scanBtn) {
        scanBtn.disabled = isRestricted;
        scanBtn.textContent = 'Try Again';
        scanBtn.classList.add('error-state');
        scanBtn.classList.remove('loading', 'success');
      }
      if (cancelBtn) cancelBtn.style.display = 'none';
      statusEl.textContent = 'Extraction failed.';
      errorEl.textContent = state.error || 'An unknown error occurred.';
      errorEl.style.display = 'block';
      break;
  }
}

// Directory scanning logic (User Story 1 & 2)
async function startDirectoryScan() {
  if (!state.tabId || state.status === 'extracting' || state.status === 'crawling') return;

  state.status = 'crawling';
  state.error = null;
  state.crawler = {
    urls: [],
    currentIndex: 0,
    results: [],
    abortController: new AbortController()
  };
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

    // 3. Request links and extract content from current page in parallel
    chrome.tabs.sendMessage(state.tabId, { action: 'extract_links' }, (linksResponse) => {
      if (chrome.runtime.lastError) {
        setCrawlerError(chrome.runtime.lastError.message);
        return;
      }

      if (!linksResponse || !linksResponse.success) {
        setCrawlerError(linksResponse ? linksResponse.error : 'Failed to extract links from tab.');
        return;
      }

      chrome.tabs.sendMessage(state.tabId, {
        action: 'extract_content',
        settings: {
          similarityThreshold: state.settings.similarityThreshold
        }
      }, async (contentResponse) => {
        if (chrome.runtime.lastError) {
          setCrawlerError(chrome.runtime.lastError.message);
          return;
        }

        if (!contentResponse || !contentResponse.success) {
          setCrawlerError(contentResponse ? contentResponse.error : 'Failed to extract current page content.');
          return;
        }

        // Filter links: pass false for allowSubdomains (not singleFile)
        const filteredLinks = parseAndFilterLinks(linksResponse.links, state.activeTab.url, false);

        if (filteredLinks.length === 0) {
          setCrawlerError('No same-domain directory links found on this page.');
          return;
        }

        // Set URLs to crawl (excluding current page as filteredLinks already excludes currentUrl)
        state.crawler.urls = filteredLinks.map(l => l.href);

        // Remove duplicates while preserving order
        state.crawler.urls = [...new Set(state.crawler.urls)];

        // Prepopulate results with the current page's content that we just extracted directly from the active tab's DOM
        const startingPageUrl = state.activeTab.url;
        state.crawler.results = [{
          title: contentResponse.data.title || state.activeTab.title || 'Untitled',
          url: contentResponse.data.url || startingPageUrl,
          markdown: contentResponse.data.markdown
        }];

        state.crawler.currentIndex = 0;
        updateUI();

        // Start crawl loop
        await executeCrawlLoop();
      });
    });
  } catch (err) {
    setCrawlerError('Failed to initialize scan: ' + err.message);
  }
}

async function executeCrawlLoop() {
  const signal = state.crawler.abortController ? state.crawler.abortController.signal : null;
  const hostname = new URL(state.activeTab.url).hostname.toLowerCase();

  while (state.crawler.currentIndex < state.crawler.urls.length) {
    if (signal && signal.aborted) {
      state.status = 'idle';
      updateUI();
      return;
    }

    const url = state.crawler.urls[state.crawler.currentIndex];
    
    try {
      // Fetch the page content
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const htmlText = await response.text();

      if (signal && signal.aborted) return;

      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      
      // Clean HTML DOM
      cleanHTMLDoc(doc, hostname);

      // Extract Content using Readability
      const reader = new Readability(doc);
      const article = reader.parse();

      if (article && article.content) {
        const turndownService = new TurndownService({ headingStyle: 'atx' });
        let markdown = turndownService.turndown(article.content);
        
        // Hybrid Deduplication logic
        markdown = deduplicateMarkdown(markdown, state.settings.similarityThreshold);

        state.crawler.results.push({
          title: article.title || doc.title || 'Untitled',
          url: url,
          markdown: markdown
        });
      }
    } catch (err) {
      console.warn(`Failed to crawl ${url}:`, err);
      // Skip the failed URL and proceed to the next one
    }

    state.crawler.currentIndex++;
    updateUI();
  }

  // Done crawling, compile and download
  try {
    if (state.crawler.results.length === 0) {
      throw new Error('No pages were successfully extracted.');
    }
    if (state.settings.singleFile) {
      await compileAndDownloadSingleFile(state.crawler.results);
    } else {
      await compileAndDownloadZIP(state.crawler.results);
    }
    state.status = 'completed';
    updateUI();
  } catch (err) {
    setCrawlerError('Download failed: ' + err.message);
  }
}

function cleanHTMLDoc(doc, hostname) {
  const allElements = doc.querySelectorAll('*');
  for (const el of allElements) {
    const style = el.getAttribute('style') || '';
    if (style.includes('display: none') || style.includes('visibility: hidden')) {
      el.remove();
    }
  }

  if (hostname.includes('wikipedia.org')) {
    const selectorsToClean = [
      '#mw-navigation', '#p-navigation', '.mw-portlet',
      '.mw-editsection', '.infobox', '.navbox', '.catlinks', '.reference'
    ];
    for (const selector of selectorsToClean) {
      const elements = doc.querySelectorAll(selector);
      for (const el of elements) {
        el.remove();
      }
    }
  }
}

async function compileAndDownloadSingleFile(results) {
  const timestamp = new Date().toISOString();
  const mainTitle = state.activeTab.title || 'extracted_site';
  const safeMainTitle = sanitizeFilename(mainTitle);
  const startingUrl = state.activeTab.url || '';

  const sourcesYaml = results.map(r => `  - ${r.url}`).join('\n');
  const frontmatter = [
    '---',
    `title: ${quoteFrontmatter(mainTitle + ' (Directory Scan)')}`,
    `url: ${startingUrl}`,
    `crawled_at: ${timestamp}`,
    `source_count: ${results.length}`,
    'sources:',
    sourcesYaml,
    '---'
  ].join('\n');

  const bodySegments = results.map(item => {
    return `## ${item.title} - ${item.url}\n\n${item.markdown}`;
  });

  const consolidatedContent = [frontmatter, '', bodySegments.join('\n\n---\n\n')].join('\n');

  await triggerDownload(consolidatedContent, `${safeMainTitle}_crawled.md`, 'text/markdown');
}

async function compileAndDownloadZIP(results) {
  if (typeof JSZip === 'undefined') {
    throw new Error('JSZip library is not loaded.');
  }

  const zip = new JSZip();
  const timestamp = new Date().toISOString();
  const mainTitle = state.activeTab.title || 'extracted_site';
  const safeMainTitle = sanitizeFilename(mainTitle);

  results.forEach((item, index) => {
    const fileNum = index + 1;
    const safeTitle = sanitizeFilename(item.title);
    
    const chunkContent = [
      '---',
      `title: ${quoteFrontmatter(item.title)}`,
      `url: ${item.url}`,
      `extracted_at: ${timestamp}`,
      `crawled_index: ${fileNum}`,
      `total_crawled: ${results.length}`,
      '---',
      '',
      item.markdown
    ].join('\n');

    zip.file(`${safeTitle}.md`, chunkContent);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const blobUrl = URL.createObjectURL(zipBlob);
  
  await chrome.downloads.download({
    url: blobUrl,
    filename: `${safeMainTitle}_crawled.zip`,
    saveAs: true
  });

  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}

function cancelDirectoryScan() {
  if (state.crawler.abortController) {
    state.crawler.abortController.abort();
  }
  state.status = 'idle';
  updateUI();
}

function setCrawlerError(msg) {
  state.status = 'error';
  state.error = msg;
  updateUI();
}

// Character similarity threshold checking
function deduplicateMarkdown(markdown, threshold) {
  const blocks = markdown.split('\n\n');
  const uniqueBlocks = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) {
      uniqueBlocks.push(block);
      continue;
    }

    // Check if this block is similar to any already accepted block
    let isDuplicate = false;
    for (const existing of uniqueBlocks) {
      const existingTrimmed = existing.trim();
      if (!existingTrimmed) continue;

      if (calculateSimilarity(trimmed, existingTrimmed) > threshold) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      uniqueBlocks.push(block);
    }
  }

  return uniqueBlocks.join('\n\n');
}

// Calculate similarity (Levenshtein distance normalized by max length)
function calculateSimilarity(str1, str2) {
  if (str1 === str2) return 1.0;
  if (!str1 || !str2) return 0.0;

  // Optimizations for fast exit
  if (Math.abs(str1.length - str2.length) / Math.max(str1.length, str2.length) > 0.2) {
    return 0.0; // Length difference is too large to meet 85% similarity
  }

  const track = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= str2.length; j += 1) track[j][0] = j;
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  const distance = track[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  return 1.0 - (distance / maxLength);
}

// Same-domain path-prefix link filtering utility
// When allowSubdomains is true, accepts links from any subdomain of the same domain
function parseAndFilterLinks(links, currentUrl, allowSubdomains = false) {
  if (!currentUrl || !Array.isArray(links)) return [];

  try {
    const parsedCurrent = new URL(currentUrl);
    const origin = parsedCurrent.origin.toLowerCase();
    const hostname = parsedCurrent.hostname.toLowerCase();
    const pathname = parsedCurrent.pathname;

    // Determine path prefix (parent directory)
    let parentPath = '/';
    const lastSlashIdx = pathname.lastIndexOf('/');
    if (lastSlashIdx >= 0) {
      parentPath = pathname.substring(0, lastSlashIdx + 1);
    }

    // Extract base domain (e.g., "example.com" from "api.example.com")
    const domainParts = hostname.split('.');
    let baseDomain = hostname;
    if (domainParts.length > 2) {
      baseDomain = domainParts.slice(-2).join('.');
    }

    const uniqueUrls = new Set();
    const filteredLinks = [];

    const cleanCurrentStr = currentUrl.replace(/#.*$/, '').replace(/\/$/, '');

    for (const link of links) {
      if (!link || !link.href) continue;

      try {
        const linkUrl = new URL(link.href, currentUrl);
        const linkHostname = linkUrl.hostname.toLowerCase();
        
        // Check domain matching based on allowSubdomains flag
        let domainMatches = false;
        if (allowSubdomains) {
          // Accept any subdomain of the same base domain
          const linkDomainParts = linkHostname.split('.');
          let linkBaseDomain = linkHostname;
          if (linkDomainParts.length > 2) {
            linkBaseDomain = linkDomainParts.slice(-2).join('.');
          }
          domainMatches = linkBaseDomain === baseDomain && linkUrl.protocol === parsedCurrent.protocol;
        } else {
          // Strict: match origin (protocol, hostname, port)
          domainMatches = linkUrl.origin.toLowerCase() === origin;
        }

        if (!domainMatches) continue;

        // When allowing subdomains, accept any path; otherwise require path prefix match
        if (!allowSubdomains && !linkUrl.pathname.startsWith(parentPath)) continue;

        // Skip non-http/https links
        if (linkUrl.protocol !== 'http:' && linkUrl.protocol !== 'https:') continue;

        // Clean link (strip hash fragment)
        linkUrl.hash = '';
        const cleanLinkStr = linkUrl.toString();
        const cleanLinkCompare = cleanLinkStr.replace(/\/$/, '');

        // Skip starting page
        if (cleanLinkCompare === cleanCurrentStr) continue;

        if (!uniqueUrls.has(cleanLinkCompare)) {
          uniqueUrls.add(cleanLinkCompare);
          filteredLinks.push({
            href: cleanLinkStr,
            text: (link.text || '').trim()
          });
        }
      } catch (e) {
        // Ignore invalid URLs
      }
    }

    return filteredLinks;
  } catch (err) {
    console.error('Error filtering links:', err);
    return [];
  }
}

// Export for Vitest and browser usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseAndFilterLinks };
} else if (typeof exports !== 'undefined') {
  exports.parseAndFilterLinks = parseAndFilterLinks;
} else {
  window.parseAndFilterLinks = parseAndFilterLinks;
}


