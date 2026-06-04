import { BaseExtractor } from "./BaseExtractor.js";

export class WikipediaExtractor extends BaseExtractor {
  preprocessDOM(dom) {
    if (dom && typeof dom.querySelectorAll === 'function') {
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
        const elements = dom.querySelectorAll(selector);
        for (const el of elements) {
          el.remove();
        }
      }
    }
    return dom;
  }
}
