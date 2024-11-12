import { Version } from './ruby/version';
import { Requirement } from './ruby/requirement';

export type ReleaseType =
  | 'major'
  | 'premajor'
  | 'minor'
  | 'preminor'
  | 'patch'
  | 'prepatch'
  | 'prerelease';

/**
 * v1 == v2 This is true if they're logically equivalent, even if they're not the exact same string. You already know how to compare strings.
 */
export function eq(v1: string, v2: string): boolean {
  const x = Version.create(v1);
  const y = Version.create(v2);
  return x.compare(y) === 0;
}

/**
 * v1 > v2
 */
export function gt(v1: string, v2: string): boolean {
  const x = Version.create(v1);
  const y = Version.create(v2);
  return x.compare(y) === 1;
}

/**
 * v1 >= v2
 */
export function gte(v1: string, v2: string): boolean {
  const x = Version.create(v1);
  const y = Version.create(v2);
  return x.compare(y) !== -1;
}

/**
 * v1 > v2
 */
export function lt(v1: string, v2: string): boolean {
  const x = Version.create(v1);
  const y = Version.create(v2);
  return x.compare(y) === -1;
}

/**
 * v1 >= v2
 */
export function lte(v1: string, v2: string): boolean {
  const x = Version.create(v1);
  const y = Version.create(v2);
  return x.compare(y) !== 1;
}

/**
 * Return the parsed version, or null if it's not valid.
 */
export function valid(version: string | null | undefined): string | null {
  if (!version) return null;
  return Version.isCorrect(version) ? version : null;
}

/**
 * Return true if the version satisfies the range.
 */
export function satisfies(version: string, range: string): boolean {
  try {
    const v = new Version(version);
    const r = new Requirement(...range.split(/\s*,\s*/));
    return r.isSatisfiedBy(v);
  } catch {
    return false;
  }
}

/**
 * Return the highest version in the list that satisfies the range, or null if none of them do.
 */
export function maxSatisfying(
  versions: string[],
  range: string,
): string | null {
  return versions.reduce((x, y) => {
    const isValid = satisfies(y, range);
    if (isValid && (!x || lt(x, y))) return y;
    return x;
  }, null);
}

/**
 * Return the lowest version in the list that satisfies the range, or null if none of them do.
 */
export function minSatisfying(
  versions: string[],
  range: string,
): string | null {
  return versions.reduce((x, y) => {
    const isValid = satisfies(y, range);
    if (isValid && (!x || gt(x, y))) return y;
    return x;
  }, null);
}

/**
 * Return the major version number.
 */
export function major(v: string | null | undefined): number {
  if (!v) return null;
  const version = Version.create(v);
  if (!version) return null;
  const [segments] = version.splitSegments();
  const [x] = segments;
  return x;
}

/**
 * Return the minor version number.
 */
export function minor(v: string | null | undefined): number {
  if (!v) return null;
  const version = Version.create(v);
  if (!version) return null;
  const [segments] = version.splitSegments();
  const [, x] = segments;
  return typeof x === 'number' ? x : null;
}

/**
 * Return the patch version number.
 */
export function patch(v: string | null | undefined): number {
  if (!v) return null;
  const version = Version.create(v);
  if (!version) return null;
  const [segments] = version.splitSegments();
  const [, , x] = segments;
  return typeof x === 'number' ? x : null;
}

/**
 * Returns an array of prerelease components, or null if none exist.
 */
export function prerelease(v: string | null | undefined): string[] | null {
  if (!v) return null;
  const version = Version.create(v);
  if (!version) return null;
  const [, segments] = version.splitSegments();
  return segments.length ? segments.map((x) => x.toString()) : null;
}
