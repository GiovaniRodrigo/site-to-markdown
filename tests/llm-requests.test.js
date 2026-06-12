import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleImproveMarkdown } from '../background.js';

describe('LLM API Improvement Request Handlers', () => {
  let fetchSpy;

  beforeEach(() => {
    vi.stubGlobal('fetch', () => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should include the user objective in request prompts if provided', async () => {
    fetchSpy = vi.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          candidates: [{ content: { parts: [{ text: 'Refined Markdown Content' }] } }]
        })
      })
    );
    vi.stubGlobal('fetch', fetchSpy);

    const config = {
      llmProvider: 'gemini',
      llmApiKey: 'KEY',
      llmModel: 'gemini-1.5-flash',
      llmPromptTemplate: 'Clean up markdown.',
      llmObjective: 'Summarize key points'
    };

    const content = '# Raw Markdown';
    const result = await handleImproveMarkdown(config, content);

    expect(result.success).toBe(true);
    expect(result.improvedMarkdown).toBe('Refined Markdown Content');
    
    const [_, calledOptions] = fetchSpy.mock.calls[0];
    const body = JSON.parse(calledOptions.body);
    const textPart = body.contents[0].parts[0].text;
    
    expect(textPart).toContain('Goal/Objective: Summarize key points');
    expect(textPart).toContain('Clean up markdown.');
    expect(textPart).toContain('# Raw Markdown');
  });

  it('should parse OpenAI completions structure correctly', async () => {
    fetchSpy = vi.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'OpenAI Refined Content' } }]
        })
      })
    );
    vi.stubGlobal('fetch', fetchSpy);

    const config = {
      llmProvider: 'openai',
      llmApiKey: 'KEY',
      llmModel: 'gpt-4o-mini'
    };

    const result = await handleImproveMarkdown(config, '# Text');
    expect(result.success).toBe(true);
    expect(result.improvedMarkdown).toBe('OpenAI Refined Content');
  });

  it('should parse Ollama chat structure correctly', async () => {
    fetchSpy = vi.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          message: { content: 'Ollama Refined Content' }
        })
      })
    );
    vi.stubGlobal('fetch', fetchSpy);

    const config = {
      llmProvider: 'ollama',
      llmModel: 'llama3'
    };

    const result = await handleImproveMarkdown(config, '# Text');
    expect(result.success).toBe(true);
    expect(result.improvedMarkdown).toBe('Ollama Refined Content');
  });

  it('should throw clear error on API failures', async () => {
    fetchSpy = vi.fn().mockImplementation(() => 
      Promise.resolve({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Invalid API Key')
      })
    );
    vi.stubGlobal('fetch', fetchSpy);

    const config = {
      llmProvider: 'openai',
      llmApiKey: 'WRONG_KEY'
    };

    await expect(handleImproveMarkdown(config, '# Text')).rejects.toThrow('API error (401): Invalid API Key');
  });
});
