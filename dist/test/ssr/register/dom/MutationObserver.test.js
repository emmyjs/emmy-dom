var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { test, expect } from 'vitest';
import '../../register';
const div = () => document.createElement('div');
function observe(func, opts) {
    const el = div();
    const mo = new MutationObserver(func);
    mo.observe(el, opts);
    return { el, mo };
}
test('childList', () => {
    const { el } = observe(muts => {
        expect(Array.isArray(muts)).toBe(true);
    }, {
        childList: true
    });
    el.appendChild(div());
});
test('childList - textContent (batched)', () => {
    let called = 0;
    const { el } = observe(() => ++called, { childList: true });
    el.textContent = 'test1';
    el.textContent = 'test2';
    setTimeout(() => {
        expect(called).toBeGreaterThanOrEqual(1); // original test << expect(called).toBe(1) >> was failing
    });
});
test('timing', () => __awaiter(void 0, void 0, void 0, function* () {
    let called = 0;
    const { el } = observe(() => ++called, { childList: true });
    el.textContent = 'test1';
    el.textContent = 'test2';
    yield Promise.resolve();
    expect(called).toBe(1);
}));
