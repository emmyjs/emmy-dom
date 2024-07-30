import { test, expect } from 'vitest';
import '../../register';
test('should still be instanceof object', () => {
    expect({}).toBeInstanceOf(Object);
});
