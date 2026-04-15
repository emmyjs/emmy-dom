import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Worker from '../../../../src/ssr/register/dom/Worker.js';

describe('Worker', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.window = {} as any;
    global.postMessage = vi.fn();
    global.__TEST_FS_MOCK__ = 'console.log("mocked")';
    global.document = {
      ssr: { scriptBase: '/fake' },
    } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (global as any).document;
    delete (global as any).__TEST_FS_MOCK__;
  });

  it('instantiates and triggers postMessage', () => {
    // Definiremos el mock global para enviar mensajes como context interno de postMessage
    global.__TEST_FS_MOCK__ = 'postMessage("simulated")';
    const worker = new Worker('some-file.js');
    
    const handler = vi.fn();
    worker.onmessage = handler;
    worker.postMessage('hello');
    
    expect(handler).toHaveBeenCalledWith({ data: 'hello' });
  });

  it('triggers onmessage without blowing up when unset', () => {
    global.__TEST_FS_MOCK__ = 'postMessage("simulated")';
    const worker = new Worker('no-handler.js');
    worker.postMessage('should drop'); // No onmessage set
    expect(worker.onmessage).toBeUndefined();
  });
});
