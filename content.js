// content.js - Site-to-Markdown Extension Content Script

// Keep track of listener to avoid double binding
if (typeof window.siteToMarkdownLoaded === 'undefined') {
  window.siteToMarkdownLoaded = true;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extract_content') {
      try {
        const result = performExtraction(request.settings);
        sendResponse({ success: true, data: result });
      } catch (error) {
        console.error('Extraction failed:', error);
        sendResponse({ success: false, error: error.message });
      }
    } else if (request.action === 'extract_links') {
      try {
        const links = [];
        const anchors = document.querySelectorAll('a');
        for (const a of anchors) {
          const href = a.getAttribute('href');
          if (href) {
            links.push({
              href: a.href,
              text: (a.innerText || a.textContent || '').trim()
            });
          }
        }
        sendResponse({ success: true, links });
      } catch (error) {
        console.error('Link extraction failed:', error);
        sendResponse({ success: false, error: error.message });
      }
    }
    return true; // Keep message channel open for async response
  });
  
  console.log('Site-to-Markdown content script initialized.');
}

function performExtraction(settings) {
  const url = window.location.href;
  const title = document.title;
  const hostname = window.location.hostname.toLowerCase();

  // Clone document to avoid modifying the active page
  const docClone = document.cloneNode(true);

  // Preprocessing
  // Prune hidden elements
  const allElements = docClone.querySelectorAll('*');
  for (const el of allElements) {
    const style = el.getAttribute('style') || '';
    if (style.includes('display: none') || style.includes('visibility: hidden')) {
      el.remove();
    }
  }

  // Wikipedia specific cleanup
  if (hostname.includes('wikipedia.org')) {
    const selectorsToClean = [
      '#mw-navigation',
      '#p-navigation',
      '.mw-portlet',
      '.mw-editsection',
      '.infobox',
      '.navbox',
      '.catlinks',
      '.reference'
    ];
    for (const selector of selectorsToClean) {
      const elements = docClone.querySelectorAll(selector);
      for (const el of elements) {
        el.remove();
      }
    }
  }

  // Parse using Readability
  if (typeof Readability === 'undefined') {
    throw new Error('Readability library not loaded in content script.');
  }

  const reader = new Readability(docClone);
  const article = reader.parse();

  if (!article || !article.content) {
    throw new Error('Could not parse page content.');
  }

  // Convert to Markdown using Turndown
  if (typeof TurndownService === 'undefined') {
    throw new Error('Turndown library not loaded in content script.');
  }

  const turndownService = new TurndownService({ headingStyle: 'atx' });
  let markdown = turndownService.turndown(article.content);

  // Hybrid Deduplication logic
  markdown = deduplicateMarkdown(markdown, settings.similarityThreshold || 0.85);

  return {
    title: article.title || title || 'Untitled',
    url: url,
    markdown: markdown
  };
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
