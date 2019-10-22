// import { Version } from "./ruby/version";
// import { Requirement } from "./ruby/requirement";

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
  return false;
}

/**
 * v1 > v2
 */
export function gt(v1: string, v2: string): boolean {
  return false;
}

/**
 * v1 >= v2
 */
export function gte(v1: string, v2: string): boolean {
  return false;
}

/**
 * v1 <= v2
 */
export function lte(v1: string, v2: string): boolean {
  return false;
}

/**
 * Return the parsed version, or null if it's not valid.
 */
export function valid(version: string): string | null {
  return null;
}

/**
 * Return true if the version satisfies the range.
 */
export function satisfies(version: string, range: string): boolean {
  return false;
}

/**
 * Return the highest version in the list that satisfies the range, or null if none of them do.
 */
export function maxSatisfying(
  versions: string[],
  range: string
): string | null {
  return null;
}

/**
 * Return the lowest version in the list that satisfies the range, or null if none of them do.
 */
export function minSatisfying(
  versions: string[],
  range: string
): string | null {
  return null;
}

/**
 * Returns difference between two versions by the release type (major, premajor, minor, preminor, patch, prepatch, or prerelease), or null if the versions are the same.
 */
export function diff(v1: string, v2: string): ReleaseType | null {
  return null;
}

/**
 * Return the major version number.
 */
export function major(v: string): number {
  return 0;
}

/**
 * Return the minor version number.
 */
export function minor(v: string): number {
  return 0;
}

/**
 * Return the patch version number.
 */
export function patch(v: string): number {
  return 0;
}

/**
 * Returns an array of prerelease components, or null if none exist.
 */
export function prerelease(v: string): string[] | null {
  return null;
}
