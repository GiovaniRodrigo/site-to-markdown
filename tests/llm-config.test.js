import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleTestConnection } from '../background.js';

describe('LLM API Connection Builders', () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = vi.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('OK')
      })
    );
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should format Gemini API connection requests correctly', async () => {
    const config = {
      llmProvider: 'gemini',
      llmApiKey: 'TEST_GEMINI_KEY',
      llmModel: 'gemini-1.5-flash',
      llmCustomEndpoint: ''
    };

    const result = await handleTestConnection(config);
    
    expect(result.success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toBe('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=TEST_GEMINI_KEY');
    
    const body = JSON.parse(calledOptions.body);
    expect(body.contents[0].parts[0].text).toBe('ping');
  });

  it('should format OpenAI API connection requests with authentication headers', async () => {
    const config = {
      llmProvider: 'openai',
      llmApiKey: 'TEST_OPENAI_KEY',
      llmModel: 'gpt-4o-mini',
      llmCustomEndpoint: ''
    };

    const result = await handleTestConnection(config);
    
    expect(result.success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toBe('https://api.openai.com/v1/chat/completions');
    expect(calledOptions.headers['Authorization']).toBe('Bearer TEST_OPENAI_KEY');
    
    const body = JSON.parse(calledOptions.body);
    expect(body.model).toBe('gpt-4o-mini');
  });

  it('should format Anthropic API requests with appropriate headers', async () => {
    const config = {
      llmProvider: 'anthropic',
      llmApiKey: 'TEST_CLAUDE_KEY',
      llmModel: 'claude-3-5-sonnet-20240620',
      llmCustomEndpoint: ''
    };

    const result = await handleTestConnection(config);
    
    expect(result.success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toBe('https://api.anthropic.com/v1/messages');
    expect(calledOptions.headers['x-api-key']).toBe('TEST_CLAUDE_KEY');
    expect(calledOptions.headers['anthropic-version']).toBe('2023-06-01');
  });

  it('should format Ollama API connection requests to localhost by default', async () => {
    const config = {
      llmProvider: 'ollama',
      llmApiKey: '',
      llmModel: 'llama3',
      llmCustomEndpoint: ''
    };

    const result = await handleTestConnection(config);
    
    expect(result.success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toBe('http://localhost:11434/api/chat');
    
    const body = JSON.parse(calledOptions.body);
    expect(body.model).toBe('llama3');
    expect(body.stream).toBe(false);
  });
});
