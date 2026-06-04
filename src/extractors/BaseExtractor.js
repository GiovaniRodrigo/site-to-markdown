import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";

export class BaseExtractor {
  constructor(options = {}) {
    this.options = {
      tokenLimit: options.tokenLimit || 4000,
      deduplicationSimilarity: options.deduplicationSimilarity || 0.85,
      multiFile: options.multiFile || false,
    };
  }

  // Template method defining the strict pipeline sequence
  extract(dom) {
    const preprocessedDom = this.preprocessDOM(dom);
    const rawContent = this.extractContent(preprocessedDom);
    const cleanMarkdown = this.postprocessMarkdown(rawContent);
    const deduplicatedMarkdown = this.deduplicate(cleanMarkdown);
    return this.formatOutput(deduplicatedMarkdown);
  }

  // Default hook implementations
  preprocessDOM(dom) {
    return dom;
  }

  extractContent(dom) {
    if (dom && typeof dom.cloneNode === 'function') {
      const docClone = dom.cloneNode(true);
      // Strip display:none or visibility:hidden elements if they have a style property
      const allElements = docClone.querySelectorAll('*');
      for (const el of allElements) {
        const style = el.getAttribute('style') || '';
        if (style.includes('display: none') || style.includes('visibility: hidden')) {
          el.remove();
        }
      }

      const reader = new Readability(docClone);
      const article = reader.parse();
      if (article && article.content) {
        const turndownService = new TurndownService({ headingStyle: 'atx' });
        return turndownService.turndown(article.content);
      }
    }
    return typeof dom === 'string' ? dom : '';
  }

  postprocessMarkdown(markdown) {
    return markdown;
  }

  deduplicate(markdown) {
    return markdown;
  }

  formatOutput(markdown) {
    return markdown;
  }
}
