import { describe, it, expect, vi, beforeEach } from 'vitest';
import { each, execCode, execFile, expose, find, prop, walk } from '../../../../src/ssr/register/util/index.js';

vi.mock('vm', () => ({
  runInNewContext: vi.fn((code) => code),
}));

describe('ssr/register/util', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.document = {
      ssr: { scriptBase: '/fake/base' },
      createTreeWalker: vi.fn(),
    } as any;
    global.window = {} as any;
    });

  describe('execFile', () => {
    it('should read and execute file code', () => {
      global.document.ssr.scriptBase = __dirname;
      const result = execFile('dummy.js');
      expect(result).toContain('dummy');
      });
    });

  describe('find', () => {
    it('should return the first matched node if opts.one is true', () => {
      const mockNode1 = { id: 1 };
      const mockNode2 = { id: 2 };
      let callCount = 0;
      global.document.createTreeWalker = vi.fn().mockReturnValue({
        nextNode: () => {
          callCount++;
          if (callCount === 1) return true;
          if (callCount === 2) return true;
          return false;
        },
        get currentNode() {
          if (callCount === 1) return mockNode1;
          if (callCount === 2) return mockNode2;
          return null;
        }
        });

      const root = {};
      const result = find(root, (node) => node.id === 1, { one: true });
      expect(result).toBe(mockNode1);
      });
    });

  describe('walk', () => {
    it('should return early if root is falsy', () => {
      walk(null, vi.fn());
      expect(global.document.createTreeWalker).not.toHaveBeenCalled();
      });

    it('should call the callback for each node', () => {
      let callCount = 0;
      global.document.createTreeWalker = vi.fn().mockReturnValue({
        nextNode: () => {
          callCount++;
          return callCount <= 2;
        },
        get currentNode() {
          return { id: callCount };
        }
        });
      const callback = vi.fn();
      walk({}, callback);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('each', () => {
    it('returns falsy node immediately', () => {
      expect(each(null, vi.fn())).toBeNull();
      });
    it('calls function on each childNode if fragment', () => {
      const call = vi.fn();
      const node = { nodeName: '#document-fragment', childNodes: [1, 2] };
      each(node, call);
      expect(call).toHaveBeenCalledTimes(2);
      });
    it('calls function on node if not fragment', () => {
      const call = vi.fn();
      const node = { nodeName: 'div' };
      each(node, call);
      expect(call).toHaveBeenCalledWith(node);
      });
    });

  describe('execCode', () => {
    it('executes code in new context via vm', () => {
      const context = {};
      execCode('console.log(1)', { context });
      // In our mock, runInNewContext returns code
      expect(execCode('"data"', { context })).toBe('data');
      });
    });

  describe('expose', () => {
    it('sets variable in global and window', () => {
      expose('MyTestVar', 'MyTestVal');
      expect(global.MyTestVar).toBe('MyTestVal');
      expect(window.MyTestVar).toBe('MyTestVal');
      });
    });

  describe('find without one', () => {
    it('returns list of matched nodes', () => {
      const mockNode1 = { id: 1 };
      const mockNode2 = { id: 2 };
      let callCount = 0;
      global.document.createTreeWalker = vi.fn().mockReturnValue({
        nextNode: () => {
          callCount++;
          return callCount <= 2;
        },
        get currentNode() {
          if (callCount === 1) return mockNode1;
          if (callCount === 2) return mockNode2;
          return null;
        }
        });
      const result = find({}, (n) => true);
      expect(result).toEqual([mockNode1, mockNode2]);
      });
    });

  describe('prop', () => {
    it('defines property on object', () => {
      const obj = {};
      prop(obj, 'testProp', { value: 'testValue' });
      expect(obj.testProp).toBe('testValue');
      });
    });
  });
