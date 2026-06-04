import { describe, it, expect } from 'vitest';
import { GenericExtractor } from '../../src/extractors/GenericExtractor.js';
import { JSDOM } from 'jsdom';

describe('GenericExtractor', () => {
  it('should inherit options and properties from BaseExtractor', () => {
    const extractor = new GenericExtractor({ tokenLimit: 5000 });
    expect(extractor.options.tokenLimit).toBe(5000);
    expect(extractor.options.multiFile).toBe(false);
  });

  it('should run default Readability isolation and Turndown conversion on DOM', () => {
    const dom = new JSDOM('<!DOCTYPE html><html><body><div id="content"><h1>Title</h1><p>Some text</p></div></body></html>');
    const extractor = new GenericExtractor();
    const result = extractor.extract(dom.window.document);
    expect(result).toContain('# Title');
    expect(result).toContain('Some text');
  });
});
