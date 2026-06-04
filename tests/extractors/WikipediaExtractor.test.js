import { describe, it, expect } from 'vitest';
import { WikipediaExtractor } from '../../src/extractors/WikipediaExtractor.js';
import { JSDOM } from 'jsdom';

describe('WikipediaExtractor', () => {
  it('should clean Wikipedia-specific navigation and edit links during preprocessing', () => {
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="content">
            <div class="mw-portlet" id="p-navigation">Navigation Links</div>
            <span class="mw-editsection">Edit Link</span>
            <h1>Wikipedia Article</h1>
            <p>This is the main article content.</p>
            <table class="infobox">
              <tr>
                <td>Info Table</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `);
    const extractor = new WikipediaExtractor();
    const result = extractor.extract(dom.window.document);
    
    // We expect the main article title and content to be present
    expect(result).toContain('# Wikipedia Article');
    expect(result).toContain('This is the main article content.');
    
    // We expect Wikipedia navigation, edit buttons, and infobox to have been pruned
    expect(result).not.toContain('Navigation Links');
    expect(result).not.toContain('Edit Link');
    expect(result).not.toContain('Info Table');
  });
});
