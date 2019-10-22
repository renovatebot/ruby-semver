import { eq } from '../lib/index';

test('eq', () => {
  expect(eq('1.0.0', '1.0.1')).toBe(false);
});
