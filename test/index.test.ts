import {
  eq,
  gt,
  gte,
  lt,
  lte,
  valid,
  satisfies,
  maxSatisfying as max,
  minSatisfying as min,
  major,
  minor,
  patch,
  prerelease,
  diff,
} from '../lib';

function checkAsymmetric<T>(
  op: (x: T, y: T) => boolean,
  left: T,
  right: T,
  result = true
) {
  expect(op(left, right)).toBe(result);
  expect(op(right, left)).toBe(!result);
}

function checkSymmetric<T>(
  op: (x: T, y: T) => boolean,
  left: T,
  right: T,
  result = true
) {
  expect(op(left, right)).toBe(result);
  expect(op(right, left)).toBe(result);
}

test('eq', () => {
  checkSymmetric(eq, '1.0.0', '1');
  checkSymmetric(eq, '1.0.0', '1.0');
  checkSymmetric(eq, '1.0.0', '1.0.0');
  checkSymmetric(eq, '1.0.0', '1.0.1', false);
});

test('gt', () => {
  checkAsymmetric(gt, '2', '1');
  checkAsymmetric(gt, '2.2', '2.1');
  checkAsymmetric(gt, '2.2.1', '2.2.0');
  checkAsymmetric(gt, '3.0.0.rc2', '3.0.0.rc1');
  checkAsymmetric(gt, '3.0.0-rc.2', '3.0.0-rc.1');
  checkAsymmetric(gt, '3.0.0.rc1', '3.0.0.beta');
  checkAsymmetric(gt, '3.0.0-rc.1', '3.0.0-beta');
  checkAsymmetric(gt, '3.0.0.beta', '3.0.0.alpha');
  checkAsymmetric(gt, '3.0.0-beta', '3.0.0-alpha');
  checkAsymmetric(gt, '5.0.1.rc1', '5.0.1.beta1');
  checkAsymmetric(gt, '5.0.1-rc.1', '5.0.1-beta.1');
});

test('gte', () => {
  checkSymmetric(gte, '1.0.0', '1');
  checkSymmetric(gte, '1.0.0', '1.0');
  checkSymmetric(gte, '1.0.0', '1.0.0');
  checkAsymmetric(gte, '1.0.0', '1.0.1', false);

  checkAsymmetric(gte, '2', '1');
  checkAsymmetric(gte, '2.2', '2.1');
  checkAsymmetric(gte, '2.2.1', '2.2.0');
  checkAsymmetric(gte, '3.0.0.rc2', '3.0.0.rc1');
  checkAsymmetric(gte, '3.0.0-rc.2', '3.0.0-rc.1');
  checkAsymmetric(gte, '3.0.0.rc1', '3.0.0.beta');
  checkAsymmetric(gte, '3.0.0-rc.1', '3.0.0-beta');
  checkAsymmetric(gte, '3.0.0.beta', '3.0.0.alpha');
  checkAsymmetric(gte, '3.0.0-beta', '3.0.0-alpha');
  checkAsymmetric(gte, '5.0.1.rc1', '5.0.1.beta1');
  checkAsymmetric(gte, '5.0.1-rc.1', '5.0.1-beta.1');
});

test('lt', () => {
  checkAsymmetric(lt, '2', '1', false);
  checkAsymmetric(lt, '2.2', '2.1', false);
  checkAsymmetric(lt, '2.2.1', '2.2.0', false);
  checkAsymmetric(lt, '3.0.0.rc2', '3.0.0.rc1', false);
  checkAsymmetric(lt, '3.0.0-rc.2', '3.0.0-rc.1', false);
  checkAsymmetric(lt, '3.0.0.rc1', '3.0.0.beta', false);
  checkAsymmetric(lt, '3.0.0-rc.1', '3.0.0-beta', false);
  checkAsymmetric(lt, '3.0.0.beta', '3.0.0.alpha', false);
  checkAsymmetric(lt, '3.0.0-beta', '3.0.0-alpha', false);
  checkAsymmetric(lt, '5.0.1.rc1', '5.0.1.beta1', false);
  checkAsymmetric(lt, '5.0.1-rc.1', '5.0.1-beta.1', false);
});

test('lte', () => {
  checkSymmetric(lte, '1.0.0', '1');
  checkSymmetric(lte, '1.0.0', '1.0');
  checkSymmetric(lte, '1.0.0', '1.0.0');
  checkAsymmetric(lte, '1.0.0', '1.0.1', true);

  checkAsymmetric(lte, '2', '1', false);
  checkAsymmetric(lte, '2.2', '2.1', false);
  checkAsymmetric(lte, '2.2.1', '2.2.0', false);
  checkAsymmetric(lte, '3.0.0.rc2', '3.0.0.rc1', false);
  checkAsymmetric(lte, '3.0.0-rc.2', '3.0.0-rc.1', false);
  checkAsymmetric(lte, '3.0.0.rc1', '3.0.0.beta', false);
  checkAsymmetric(lte, '3.0.0-rc.1', '3.0.0-beta', false);
  checkAsymmetric(lte, '3.0.0.beta', '3.0.0.alpha', false);
  checkAsymmetric(lte, '3.0.0-beta', '3.0.0-alpha', false);
  checkAsymmetric(lte, '5.0.1.rc1', '5.0.1.beta1', false);
  checkAsymmetric(lte, '5.0.1-rc.1', '5.0.1-beta.1', false);
});

test('valid', () => {
  expect(valid('1.0.0')).toBe('1.0.0');
  expect(valid('1.0.0.')).toBe(null);
  expect(valid('')).toBe(null);
  expect(valid(null)).toBe(null);
});

test('satisfies', () => {
  expect(satisfies('1.2', '>= 1.2')).toBe(true);
  expect(satisfies('1.2.3', '~> 1.2.1')).toBe(true);
  expect(satisfies('1.2.7', '1.2.7')).toBe(true);
  expect(satisfies('1.1.6', '>= 1.1.5, < 2.0')).toBe(true);

  expect(satisfies('1.2', '>= 1.3')).toBe(false);
  expect(satisfies('1.3.8', '~> 1.2.1')).toBe(false);
  expect(satisfies('1.3.9', '1.3.8')).toBe(false);
  expect(satisfies('2.0.0', '>= 1.1.5, < 2.0')).toBe(false);

  expect(satisfies('0.', '>= 0')).toBe(false);
  expect(satisfies('0.1', '>= 0..1')).toBe(false);
});

test('maxSatisfying', () => {
  expect(max(['2.1.5', '2.1.6'], '~> 2.1')).toEqual('2.1.6');

  expect(max(['2.1.6', '2.1.5'], '~> 2.1.6')).toEqual('2.1.6');

  expect(max(['4.7.3', '4.7.4', '4.7.5', '4.7.9'], '~> 4.7, >= 4.7.4')).toEqual(
    '4.7.9'
  );

  expect(max(['2.5.3', '2.5.4', '2.5.5', '2.5.6'], '~>2.5.3')).toEqual('2.5.6');

  expect(
    max(
      ['2.1.0', '3.0.0.beta', '2.3', '3.0.0-rc.1', '3.0.0', '3.1.1'],
      '~> 3.0'
    )
  ).toEqual('3.1.1');

  expect(max(['1.2.3', '1.2.4'], '>= 3.5.0')).toBeNull();
});

test('minSatisfying', () => {
  expect(min(['2.1.5', '2.1.6'], '~> 2.1')).toEqual('2.1.5');

  expect(min(['2.1.6', '2.1.5'], '~> 2.1.6')).toEqual('2.1.6');

  expect(min(['4.7.3', '4.7.4', '4.7.5', '4.7.9'], '~> 4.7, >= 4.7.4')).toEqual(
    '4.7.4'
  );

  expect(min(['2.5.3', '2.5.4', '2.5.5', '2.5.6'], '~>2.5.3')).toEqual('2.5.3');

  expect(
    min(
      ['2.1.0', '3.0.0.beta', '2.3', '3.0.0-rc.1', '3.0.0', '3.1.1'],
      '~> 3.0'
    )
  ).toEqual('3.0.0');

  expect(min(['1.2.3', '1.2.4'], '>= 3.5.0')).toBeNull();
});

test('major', () => {
  expect(major(null)).toBe(null);
  expect(major('')).toBe(null);
  expect(major('1.')).toBe(null);

  expect(major('1')).toEqual(1);
  expect(major('1.2')).toEqual(1);
  expect(major('1.2.0')).toEqual(1);
  expect(major('1.2.0.alpha.4')).toEqual(1);
});

test('minor', () => {
  expect(minor(null)).toBe(null);
  expect(minor('')).toBe(null);
  expect(minor('1.')).toBe(null);

  expect(minor('1.2')).toEqual(2);
  expect(minor('1.2.0')).toEqual(2);
  expect(minor('1.2.0.alpha.4')).toEqual(2);
  expect(minor('1')).toBeNull();
});

test('patch', () => {
  expect(patch(null)).toBe(null);
  expect(patch('')).toBe(null);
  expect(patch('1.')).toBe(null);

  expect(patch('1.2.2')).toEqual(2);
  expect(patch('1.2.1.alpha.4')).toEqual(1);
  expect(patch('1')).toBeNull();
  expect(patch('1.2')).toBeNull();
});

test('prerelease', () => {
  expect(prerelease(null)).toBe(null);
  expect(prerelease('')).toBe(null);
  expect(prerelease('1.')).toBe(null);

  expect(prerelease('1.2.0-alpha')).toEqual(['pre', 'alpha']);
  expect(prerelease('1.2.0.alpha')).toEqual(['alpha']);
  expect(prerelease('1.2.0.alpha1')).toEqual(['alpha', '1']);
  expect(prerelease('1.2.0-alpha.1')).toEqual(['pre', 'alpha', '1']);
  expect(prerelease('1')).toBe(null);
  expect(prerelease('1.2')).toBe(null);
  expect(prerelease('1.2.3')).toBe(null);
});

test('diff', () => {
  expect(diff(null, '1')).toEqual(null);
  expect(diff('1', null)).toEqual(null);
  expect(diff('1', '')).toEqual(null);
  expect(diff('1', '1.')).toEqual(null);

  expect(diff('1', '1')).toEqual(null);
  expect(diff('1.1', '1.1')).toEqual(null);
  expect(diff('1.1.2', '1.1.2')).toEqual(null);
  expect(diff('1.1.1.1', '1.1.1.1')).toEqual(null);
  expect(diff('1.0.0.alpha.1', '1.0.0.alpha.1')).toEqual(null);
  expect(diff('1.1.2-1', '1.1.2.pre.1')).toEqual(null);
  expect(diff('1.1.2.pre.1', '1.1.2-1')).toEqual(null);
  expect(diff('2', '2.0')).toEqual(null);
  expect(diff('2.0', '2')).toEqual(null);
  expect(diff('2', '2.0.0')).toEqual(null);
  expect(diff('2.0.0', '2')).toEqual(null);
  expect(diff('2', '2.0.0.0')).toEqual(null);
  expect(diff('2.0.0.0', '2')).toEqual(null);

  expect(diff('1', '3')).toEqual('major');
  expect(diff('1.1', '3.1')).toEqual('major');
  expect(diff('1.1.2', '3.0.0')).toEqual('major');
  expect(diff('1.1.2', '2.0.0')).toEqual('major');
  expect(diff('1.1.1.1', '2.0.0')).toEqual('major');

  expect(diff('1.1', '1.2')).toEqual('minor');
  expect(diff('1.1.2', '1.2.1.1')).toEqual('minor');
  expect(diff('1.1.2', '1.2.0')).toEqual('minor');
  expect(diff('1.1.2.1', '1.2.0')).toEqual('minor');
  expect(diff('1.1.2.1', '1.2.0.1')).toEqual('minor');

  expect(diff('1.1.2', '1.1.3')).toEqual('patch');
  expect(diff('1.1.2', '1.1.2.1')).toEqual('patch');
  expect(diff('1.1.2.1', '1.1.3')).toEqual('patch');
  expect(diff('1.1.2.1', '1.1.3.2.1')).toEqual('patch');
  expect(diff('1.1.2.1', '1.1.2.1.1.1.2')).toEqual('patch');
  expect(diff('1.1.2.1.1.1.1', '1.1.2.1.1.1.2')).toEqual('patch');

  expect(diff('1.0.0.alpha.1', '2.0.0')).toEqual('premajor');

  expect(diff('1.1.2.alpha.1', '1.2.0')).toEqual('preminor');

  expect(diff('1.1.2.alpha.1', '1.1.3')).toEqual('prepatch');
  expect(diff('1.1.2.3.alpha.1', '1.1.2.alpha.2')).toEqual('prepatch');
  expect(diff('1.1.2.3.alpha.1', '1.1.2.4.alpha.2')).toEqual('prepatch');
  expect(diff('1.1.2.alpha.1', '1.1.2.1')).toEqual('prepatch');

  expect(diff('1.1.2.alpha.1', '1.1.2.alpha.2')).toEqual('prerelease');
  expect(diff('1.1.2.3.alpha.1', '1.1.2.3.alpha.2')).toEqual('prerelease');
  expect(diff('1.alpha.1', '1')).toEqual('prerelease');
});
