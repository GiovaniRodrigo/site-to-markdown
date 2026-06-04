import { describe, it, expect } from 'vitest';
import { ExtractorRegistry } from '../../src/extractors/ExtractorRegistry.js';
import { WikipediaExtractor } from '../../src/extractors/WikipediaExtractor.js';
import { GenericExtractor } from '../../src/extractors/GenericExtractor.js';

describe('ExtractorRegistry', () => {
  it('should resolve standard wildcard host patterns correctly', () => {
    const registry = new ExtractorRegistry();
    
    // Wikipedia subdomains
    const wikiEn = registry.resolve('https://en.wikipedia.org/wiki/Main_Page');
    const wikiEs = registry.resolve('https://es.wikipedia.org/wiki/Special:Search');
    
    expect(wikiEn).toBeInstanceOf(WikipediaExtractor);
    expect(wikiEs).toBeInstanceOf(WikipediaExtractor);
  });

  it('should fall back to GenericExtractor for unregistered domains', () => {
    const registry = new ExtractorRegistry();
    const generic = registry.resolve('https://example.com/some/path');
    expect(generic).toBeInstanceOf(GenericExtractor);
  });

  it('should resolve safely to GenericExtractor if URL is invalid or null', () => {
    const registry = new ExtractorRegistry();
    expect(registry.resolve(null)).toBeInstanceOf(GenericExtractor);
    expect(registry.resolve('')).toBeInstanceOf(GenericExtractor);
    expect(registry.resolve('not-a-valid-url')).toBeInstanceOf(GenericExtractor);
  });
});
