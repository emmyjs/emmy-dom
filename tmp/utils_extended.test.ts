import { describe, it, expect } from 'vitest'
import { vanillaElement, processGenerator } from '../src/utils.js'

describe('vanillaElement', () => {
    it('should return lowered tag with emmy- prefix when it starts with uppercase', () => {
        expect(vanillaElement('MyComponent')).toBe('emmy-mycomponent');
    });
    it('should return original string when starts with lowercase', () => {
        expect(vanillaElement('my-component')).toBe('my-component');
    });
});
