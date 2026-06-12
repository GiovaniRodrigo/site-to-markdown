import { describe, it, expect } from 'vitest';
import { parseAndFilterLinks } from '../../popup/popup.js';

describe('parseAndFilterLinks', () => {
  const currentUrl = 'https://example.com/docs/intro';

  it('should return empty list when input is invalid', () => {
    expect(parseAndFilterLinks(null, currentUrl)).toEqual([]);
    expect(parseAndFilterLinks([], '')).toEqual([]);
  });

  it('should filter links matching the same origin and path prefix', () => {
    const links = [
      { href: 'https://example.com/docs/getting-started', text: 'Getting Started' },
      { href: 'https://example.com/docs/advanced/setup', text: 'Setup' },
      { href: 'https://example.com/blog/posts', text: 'Blog' }, // Different path prefix
      { href: 'https://otherdomain.com/docs/intro', text: 'External' }, // Different origin
      { href: 'https://example.com/docs/intro', text: 'Self' }, // Self (starting page)
    ];

    const result = parseAndFilterLinks(links, currentUrl);

    expect(result).toHaveLength(2);
    expect(result[0].href).toBe('https://example.com/docs/getting-started');
    expect(result[1].href).toBe('https://example.com/docs/advanced/setup');
  });

  it('should normalize URLs by stripping hashes and removing duplicates', () => {
    const links = [
      { href: 'https://example.com/docs/getting-started#section1', text: 'Getting Started Section 1' },
      { href: 'https://example.com/docs/getting-started#section2', text: 'Getting Started Section 2' },
      { href: 'https://example.com/docs/getting-started/', text: 'Getting Started Trailing Slash' },
    ];

    const result = parseAndFilterLinks(links, currentUrl);

    // Should only return 1 unique URL (duplicates and trailing slash variations normalized)
    expect(result).toHaveLength(1);
    expect(result[0].href).toBe('https://example.com/docs/getting-started');
  });

  it('should support non-http/https protocol exclusion', () => {
    const links = [
      { href: 'javascript:void(0)', text: 'Void' },
      { href: 'mailto:info@example.com', text: 'Email' },
      { href: 'https://example.com/docs/valid', text: 'Valid' },
    ];

    const result = parseAndFilterLinks(links, currentUrl);
    expect(result).toHaveLength(1);
    expect(result[0].href).toBe('https://example.com/docs/valid');
  });

  it('should accept subdomains when allowSubdomains is true', () => {
    const links = [
      { href: 'https://api.example.com/v1/docs', text: 'API Docs' },
      { href: 'https://docs.example.com/intro', text: 'Docs Portal' },
      { href: 'https://cdn.example.com/static', text: 'CDN' },
      { href: 'https://other-domain.com/docs/intro', text: 'External' }, // Different domain
      { href: 'https://example.com/docs/intro', text: 'Self' }, // Self (starting page)
    ];

    const result = parseAndFilterLinks(links, currentUrl, true);

    // Should accept all example.com subdomains but exclude self and different domain
    expect(result).toHaveLength(3);
    expect(result[0].href).toBe('https://api.example.com/v1/docs');
    expect(result[1].href).toBe('https://docs.example.com/intro');
    expect(result[2].href).toBe('https://cdn.example.com/static');
  });

  it('should accept any path when allowSubdomains is true', () => {
    const links = [
      { href: 'https://example.com/blog/posts', text: 'Blog' },
      { href: 'https://example.com/api/v1/docs', text: 'API' },
      { href: 'https://example.com/about', text: 'About' },
      { href: 'https://example.com/docs/intro', text: 'Self' }, // Self (starting page)
    ];

    const result = parseAndFilterLinks(links, currentUrl, true);

    // Should accept all paths from example.com when allowSubdomains is true
    expect(result).toHaveLength(3);
    expect(result.some(l => l.href.includes('/blog/posts'))).toBe(true);
    expect(result.some(l => l.href.includes('/api/v1/docs'))).toBe(true);
    expect(result.some(l => l.href.includes('/about'))).toBe(true);
  });
});
