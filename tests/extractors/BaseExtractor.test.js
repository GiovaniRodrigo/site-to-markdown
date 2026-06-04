import { describe, it, expect } from 'vitest';
import { BaseExtractor } from '../../src/extractors/BaseExtractor.js';

// Spy extractor subclass to verify lifecycle sequence and defaults
class SpyExtractor extends BaseExtractor {
  constructor(options) {
    super(options);
    this.sequence = [];
  }

  preprocessDOM(dom) {
    this.sequence.push('preprocessDOM');
    return dom;
  }

  extractContent(dom) {
    this.sequence.push('extractContent');
    return 'Raw Content';
  }

  postprocessMarkdown(markdown) {
    this.sequence.push('postprocessMarkdown');
    return markdown + ' -> Postprocessed';
  }

  deduplicate(markdown) {
    this.sequence.push('deduplicate');
    return markdown + ' -> Deduplicated';
  }

  formatOutput(markdown) {
    this.sequence.push('formatOutput');
    return 'Metadata\n' + markdown;
  }
}

describe('BaseExtractor', () => {
  it('should initialize options with correct defaults', () => {
    const extractor = new SpyExtractor();
    expect(extractor.options.tokenLimit).toBe(4000);
    expect(extractor.options.deduplicationSimilarity).toBe(0.85);
    expect(extractor.options.multiFile).toBe(false);
  });

  it('should override options if custom values are provided', () => {
    const extractor = new SpyExtractor({
      tokenLimit: 8000,
      deduplicationSimilarity: 0.90,
      multiFile: true,
    });
    expect(extractor.options.tokenLimit).toBe(8000);
    expect(extractor.options.deduplicationSimilarity).toBe(0.90);
    expect(extractor.options.multiFile).toBe(true);
  });

  it('should execute lifecycle hooks in a strict sequential pipeline', () => {
    const extractor = new SpyExtractor();
    const mockDom = {};
    const result = extractor.extract(mockDom);

    expect(extractor.sequence).toEqual([
      'preprocessDOM',
      'extractContent',
      'postprocessMarkdown',
      'deduplicate',
      'formatOutput'
    ]);
    expect(result).toBe('Metadata\nRaw Content -> Postprocessed -> Deduplicated');
  });

  it('should provide default implementations for all hooks', () => {
    class MinimalExtractor extends BaseExtractor {}
    const extractor = new MinimalExtractor();
    
    const testDom = { body: 'test' };
    expect(extractor.preprocessDOM(testDom)).toBe(testDom);
    expect(extractor.postprocessMarkdown('text')).toBe('text');
    expect(extractor.deduplicate('text')).toBe('text');
    expect(extractor.formatOutput('text')).toBe('text');
  });
});
