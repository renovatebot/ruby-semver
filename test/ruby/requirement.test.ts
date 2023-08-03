// https://github.com/ruby/ruby/blob/d4a86e407ec2057c2c7ad757aa76dad757f34c3a/test/rubygems/test_gem_requirement.rb

import { Version } from '../../lib/ruby/version';
import { parse, Requirement } from '../../lib/ruby/requirement';

const v = (x: unknown) => Version.create(x);
const req = (...x: unknown[]) => Requirement.create(...x);

// # frozen_string_literal: true
// require 'rubygems/test_case'
// require "rubygems/requirement"
//
// class TestGemRequirement < Gem::TestCase

//   def test_concat
//     r = req '>= 1'
//
//     r.concat ['< 2']
//
//     assert_equal [['>=', v(1)], ['<', v(2)]], r.requirements
//   end
test('test_concat', () => {
  const r = req('>= 1');
  r.concat(['< 2']);
  expect(r._requirements).toEqual([
    ['>=', v(1)],
    ['<', v(2)],
  ]);
});

//   def test_equals2
//     r = req "= 1.2"
//     assert_equal r, r.dup
//     assert_equal r.dup, r
//
//     refute_requirement_equal "= 1.2", "= 1.3"
//     refute_requirement_equal "= 1.3", "= 1.2"
//
//     refute_requirement_equal "~> 1.3", "~> 1.3.0"
//     refute_requirement_equal "~> 1.3.0", "~> 1.3"
//
//     assert_requirement_equal ["> 2", "~> 1.3"], ["> 2.0", "~> 1.3"]
//     assert_requirement_equal ["> 2.0", "~> 1.3"], ["> 2", "~> 1.3"]
//
//     refute_equal Object.new, req("= 1.2")
//     refute_equal req("= 1.2"), Object.new
//   end
test('test_equals2', () => {
  refuteRequirementEqual('= 1.2', '= 1.3');
  refuteRequirementEqual('~> 1.3', '~> 1.3.0');
  assertRequirementEqual(['> 2', '~> 1.3'], ['> 2.0', '~> 1.3']);
  refuteRequirementEqual(['> 2', '~> 1.3'], ['> 2']);
});

//   def test_initialize
//     assert_requirement_equal "= 2", "2"
//     assert_requirement_equal "= 2", ["2"]
//     assert_requirement_equal "= 2", v(2)
//     assert_requirement_equal "2.0", "2"
//   end
test('test_initialize', () => {
  assertRequirementEqual('= 2', '2');
  assertRequirementEqual('= 2', ['2']);
  assertRequirementEqual('= 2', v(2));
  assertRequirementEqual('2.0', '2');
});

//   def test_create
//     assert_equal req("= 1"), Gem::Requirement.create("= 1")
//     assert_equal req(">= 1.2", "<= 1.3"), Gem::Requirement.create([">= 1.2", "<= 1.3"])
//     assert_equal req(">= 1.2", "<= 1.3"), Gem::Requirement.create(">= 1.2", "<= 1.3")
//   end
test('test_create', () => {
  const r = req('= 1', '= 1');
  expect(r._requirements).toHaveLength(1);
  assertRequirementEqual(['= 1', '= 1'], ['= 1']);
  assertRequirementEqual(['>= 1.2', '<= 1.3'], ['>= 1.2', ['<= 1.3']]);
});

//   def test_empty_requirements_is_none
//     r = Gem::Requirement.new
//     assert_equal true, r.none?
//   end
test('test_empty_requirements_is_none', () => {
  expect(new Requirement().isNone()).toBe(true);
  expect(req().isNone()).toBe(true);
  expect(req(null).isNone()).toBe(true);
});

//   def test_explicit_default_is_none
//     r = Gem::Requirement.new ">= 0"
//     assert_equal true, r.none?
//   end
test('test_explicit_default_is_none', () => {
  expect(req('>= 0').isNone()).toBe(true);
});

//   def test_basic_non_none
//     r = Gem::Requirement.new "= 1"
//     assert_equal false, r.none?
//   end
test('test_basic_non_none', () => {
  expect(req('= 1').isNone()).toBe(false);
  expect(req('>= 1.4', '<= 1.6', '!= 1.5').isNone()).toBe(false);
});

//   def test_for_lockfile
//     assert_equal ' (~> 1.0)', req('~> 1.0').for_lockfile
//
//     assert_equal ' (~> 1.0, >= 1.0.1)', req('>= 1.0.1', '~> 1.0').for_lockfile
//
//     duped = req '= 1.0'
//     duped.requirements << ['=', v('1.0')]
//
//     assert_equal ' (= 1.0)', duped.for_lockfile
//
//     assert_nil Gem::Requirement.default.for_lockfile
//   end

//   def test_parse
//     assert_equal ['=', Gem::Version.new(1)], Gem::Requirement.parse('  1')
//     assert_equal ['=', Gem::Version.new(1)], Gem::Requirement.parse('= 1')
//     assert_equal ['>', Gem::Version.new(1)], Gem::Requirement.parse('> 1')
//     assert_equal ['=', Gem::Version.new(1)], Gem::Requirement.parse("=\n1")
//     assert_equal ['=', Gem::Version.new(1)], Gem::Requirement.parse('1.0')
//
//     assert_equal ['=', Gem::Version.new(2)],
//       Gem::Requirement.parse(Gem::Version.new('2'))
//   end
test('test_parse', () => {
  expect(Requirement.parse('  1')).toEqual(['=', v(1)]);
  expect(Requirement.parse('= 1')).toEqual(['=', v(1)]);
  expect(Requirement.parse('> 1')).toEqual(['>', v(1)]);
  expect(Requirement.parse('=\n1')).toEqual(['=', v(1)]);
  expect(Requirement.parse('1.0')).toEqual(['=', v('1.0')]);
  expect(Requirement.parse('2')).toEqual(['=', v('2')]);
  expect(parse('2')).toEqual(['=', v('2')]);
});

//   def test_parse_bad
//     [
//       nil,
//       '',
//       '! 1',
//       '= junk',
//       '1..2',
//     ].each do |bad|
//       e = assert_raises Gem::Requirement::BadRequirementError do
//         Gem::Requirement.parse bad
//       end
//
//       assert_equal "Illformed requirement [#{bad.inspect}]", e.message
//     end
//
//     assert_equal Gem::Requirement::BadRequirementError.superclass, ArgumentError
//   end
test('test_parse_bad', () => {
  const invalidRequirements = [null, '', '! 1', '= junk', '1..2'];
  invalidRequirements.forEach((bad) => {
    expect(() => Requirement.parse(bad)).toThrow(
      `Illformed requirement [${bad}]`,
    );
  });
});

//   def test_prerelease_eh
//     r = req '= 1'
//
//     refute r.prerelease?
//
//     r = req '= 1.a'
//
//     assert r.prerelease?
//
//     r = req '> 1.a', '< 2'
//
//     assert r.prerelease?
//   end
test('test_prerelease_eh', () => {
  expect(req('= 1').isPrerelease()).toBe(false);
  expect(req('= 1.a').isPrerelease()).toBe(true);
  expect(req('> 1.a', '< 2').isPrerelease()).toBe(true);
});

//   def test_satisfied_by_eh_bang_equal
//     r = req '!= 1.2'
//
//     assert_satisfied_by "1.1", r
//     refute_satisfied_by "1.2", r
//     assert_satisfied_by "1.3", r
//
//     assert_raises ArgumentError do
//       assert_satisfied_by nil, r
//     end
//   end
test('test_satisfied_by_eh_bang_equal', () => {
  const r = req('!= 1.2');
  assertSatisfiedBy('1.1', r);
  refuteSatisfiedBy('1.2', r);
  assertSatisfiedBy('1.3', r);
});

//   def test_satisfied_by_eh_blank
//     r = req "1.2"
//
//     refute_satisfied_by "1.1", r
//     assert_satisfied_by "1.2", r
//     refute_satisfied_by "1.3", r
//
//     assert_raises ArgumentError do
//       assert_satisfied_by nil, r
//     end
//   end
test('test_satisfied_by_eh_blank', () => {
  const r = req('1.2');
  refuteSatisfiedBy('1.1', r);
  assertSatisfiedBy('1.2', r);
  refuteSatisfiedBy('1.3', r);
});

//   def test_satisfied_by_eh_equal
//     r = req "= 1.2"
//
//     refute_satisfied_by "1.1", r
//     assert_satisfied_by "1.2", r
//     refute_satisfied_by "1.3", r
//
//     assert_raises ArgumentError do
//       assert_satisfied_by nil, r
//     end
//   end
test('test_satisfied_by_eh_equal', () => {
  const r = req('= 1.2');
  refuteSatisfiedBy('1.1', r);
  assertSatisfiedBy('1.2', r);
  refuteSatisfiedBy('1.3', r);
});

//   def test_satisfied_by_eh_gt
//     r = req "> 1.2"
//
//     refute_satisfied_by "1.1", r
//     refute_satisfied_by "1.2", r
//     assert_satisfied_by "1.3", r
//
//     assert_raises ArgumentError do
//       r.satisfied_by? nil
//     end
//   end
test('test_satisfied_by_eh_gt', () => {
  const r = req('> 1.2');
  refuteSatisfiedBy('1.1', r);
  refuteSatisfiedBy('1.2', r);
  assertSatisfiedBy('1.3', r);
});

//   def test_satisfied_by_eh_gte
//     r = req ">= 1.2"
//
//     refute_satisfied_by "1.1", r
//     assert_satisfied_by "1.2", r
//     assert_satisfied_by "1.3", r
//
//     assert_raises ArgumentError do
//       r.satisfied_by? nil
//     end
//   end
test('test_satisfied_by_eh_gte', () => {
  const r = req('>= 1.2');
  refuteSatisfiedBy('1.1', r);
  assertSatisfiedBy('1.2', r);
  assertSatisfiedBy('1.3', r);
});

//   def test_satisfied_by_eh_list
//     r = req "> 1.1", "< 1.3"
//
//     refute_satisfied_by "1.1", r
//     assert_satisfied_by "1.2", r
//     refute_satisfied_by "1.3", r
//
//     assert_raises ArgumentError do
//       r.satisfied_by? nil
//     end
//   end
test('test_satisfied_by_eh_list', () => {
  const r = req('> 1.1', '< 1.3');
  refuteSatisfiedBy('1.1', r);
  assertSatisfiedBy('1.2', r);
  refuteSatisfiedBy('1.3', r);
});

//   def test_satisfied_by_eh_lt
//     r = req "< 1.2"
//
//     assert_satisfied_by "1.1", r
//     refute_satisfied_by "1.2", r
//     refute_satisfied_by "1.3", r
//
//     assert_raises ArgumentError do
//       r.satisfied_by? nil
//     end
//   end
test('test_satisfied_by_eh_lt', () => {
  const r = req('< 1.2');
  assertSatisfiedBy('1.1', r);
  refuteSatisfiedBy('1.2', r);
  refuteSatisfiedBy('1.3', r);
});

//   def test_satisfied_by_eh_lte
//     r = req "<= 1.2"
//
//     assert_satisfied_by "1.1", r
//     assert_satisfied_by "1.2", r
//     refute_satisfied_by "1.3", r
//
//     assert_raises ArgumentError do
//       r.satisfied_by? nil
//     end
//   end
test('test_satisfied_by_eh_lte', () => {
  const r = req('<= 1.2');
  assertSatisfiedBy('1.1', r);
  assertSatisfiedBy('1.2', r);
  refuteSatisfiedBy('1.3', r);
});

//   def test_satisfied_by_eh_tilde_gt
//     r = req "~> 1.2"
//
//     refute_satisfied_by "1.1", r
//     assert_satisfied_by "1.2", r
//     assert_satisfied_by "1.3", r
//
//     assert_raises ArgumentError do
//       r.satisfied_by? nil
//     end
//   end
test('test_satisfied_by_eh_tilde_gt', () => {
  const r = req('~> 1.2');
  refuteSatisfiedBy('1.1', r);
  assertSatisfiedBy('1.2', r);
  assertSatisfiedBy('1.3', r);
});

//   def test_satisfied_by_eh_tilde_gt_v0
//     r = req "~> 0.0.1"
//
//     refute_satisfied_by "0.1.1", r
//     assert_satisfied_by "0.0.2", r
//     assert_satisfied_by "0.0.1", r
//   end
test('test_satisfied_by_eh_tilde_gt_v0', () => {
  const r = req('~> 0.0.1');
  refuteSatisfiedBy('0.1.1', r);
  assertSatisfiedBy('0.0.2', r);
  assertSatisfiedBy('0.0.1', r);
});

//   def test_satisfied_by_eh_good
//     assert_satisfied_by "0.2.33",      "= 0.2.33"
//     assert_satisfied_by "0.2.34",      "> 0.2.33"
//     assert_satisfied_by "1.0",         "= 1.0"
//     assert_satisfied_by "1.0.0",       "= 1.0"
//     assert_satisfied_by "1.0",         "= 1.0.0"
//     assert_satisfied_by "1.0",         "1.0"
//     assert_satisfied_by "1.8.2",       "> 1.8.0"
//     assert_satisfied_by "1.112",       "> 1.111"
//     assert_satisfied_by "0.2",         "> 0.0.0"
//     assert_satisfied_by "0.0.0.0.0.2", "> 0.0.0"
//     assert_satisfied_by "0.0.1.0",     "> 0.0.0.1"
//     assert_satisfied_by "10.3.2",      "> 9.3.2"
//     assert_satisfied_by "1.0.0.0",     "= 1.0"
//     assert_satisfied_by "10.3.2",      "!= 9.3.4"
//     assert_satisfied_by "10.3.2",      "> 9.3.2"
//     assert_satisfied_by "10.3.2",      "> 9.3.2"
//     assert_satisfied_by " 9.3.2",      ">= 9.3.2"
//     assert_satisfied_by "9.3.2 ",      ">= 9.3.2"
//     assert_satisfied_by "",            "= 0"
//     assert_satisfied_by "",            "< 0.1"
//     assert_satisfied_by "  ",          "< 0.1 "
//     assert_satisfied_by "",            " <  0.1"
//     assert_satisfied_by "  ",          "> 0.a "
//     assert_satisfied_by "",            " >  0.a"
//     assert_satisfied_by "3.1",         "< 3.2.rc1"
//
//     assert_satisfied_by "3.2.0",       "> 3.2.0.rc1"
//     assert_satisfied_by "3.2.0.rc2",   "> 3.2.0.rc1"
//
//     assert_satisfied_by "3.0.rc2",     "< 3.0"
//     assert_satisfied_by "3.0.rc2",     "< 3.0.0"
//     assert_satisfied_by "3.0.rc2",     "< 3.0.1"
//
//     assert_satisfied_by "3.0.rc2",     "> 0"
//
//     assert_satisfied_by "5.0.0.rc2",   "~> 5.a"
//     refute_satisfied_by "5.0.0.rc2",   "~> 5.x"
//
//     assert_satisfied_by "5.0.0",       "~> 5.a"
//     assert_satisfied_by "5.0.0",       "~> 5.x"
//   end
test('test_satisfied_by_eh_good', () => {
  assertSatisfiedBy('0.2.33', '= 0.2.33');
  assertSatisfiedBy('0.2.34', '> 0.2.33');
  assertSatisfiedBy('1.0', '= 1.0');
  assertSatisfiedBy('1.0.0', '= 1.0');
  assertSatisfiedBy('1.0', '= 1.0.0');
  assertSatisfiedBy('1.0', '1.0');
  assertSatisfiedBy('1.8.2', '> 1.8.0');
  assertSatisfiedBy('1.112', '> 1.111');
  assertSatisfiedBy('0.2', '> 0.0.0');
  assertSatisfiedBy('0.0.0.0.0.2', '> 0.0.0');
  assertSatisfiedBy('0.0.1.0', '> 0.0.0.1');
  assertSatisfiedBy('10.3.2', '> 9.3.2');
  assertSatisfiedBy('1.0.0.0', '= 1.0');
  assertSatisfiedBy('10.3.2', '!= 9.3.4');
  assertSatisfiedBy('10.3.2', '> 9.3.2');
  assertSatisfiedBy('10.3.2', '> 9.3.2');
  assertSatisfiedBy(' 9.3.2', '>= 9.3.2');
  assertSatisfiedBy('9.3.2 ', '>= 9.3.2');
  assertSatisfiedBy('', '= 0');
  assertSatisfiedBy('', '< 0.1');
  assertSatisfiedBy('  ', '< 0.1 ');
  assertSatisfiedBy('', ' <  0.1');
  assertSatisfiedBy('  ', '> 0.a ');
  assertSatisfiedBy('', ' >  0.a');
  assertSatisfiedBy('3.1', '< 3.2.rc1');

  assertSatisfiedBy('3.2.0', '> 3.2.0.rc1');
  assertSatisfiedBy('3.2.0.rc2', '> 3.2.0.rc1');

  assertSatisfiedBy('3.0.rc2', '< 3.0');
  assertSatisfiedBy('3.0.rc2', '< 3.0.0');
  assertSatisfiedBy('3.0.rc2', '< 3.0.1');

  assertSatisfiedBy('3.0.rc2', '> 0');

  assertSatisfiedBy('5.0.0.rc2', '~> 5.a');
  refuteSatisfiedBy('5.0.0.rc2', '~> 5.x');

  assertSatisfiedBy('5.0.0', '~> 5.a');
  assertSatisfiedBy('5.0.0', '~> 5.x');
});

//   def test_illformed_requirements
//     [ ">>> 1.3.5", "> blah" ].each do |rq|
//       assert_raises Gem::Requirement::BadRequirementError, "req [#{rq}] should fail" do
//         Gem::Requirement.new rq
//       end
//     end
//   end
test('test_illformed_requirements', () => {
  ['>>> 1.3.5', '> blah'].forEach((rq) => {
    expect(() => new Requirement(rq)).toThrow();
  });
});

//   def test_satisfied_by_eh_non_versions
//     assert_raises ArgumentError do
//       req(">= 0").satisfied_by? Object.new
//     end
//
//     assert_raises ArgumentError do
//       req(">= 0").satisfied_by? Gem::Requirement.default
//     end
//   end

//   def test_satisfied_by_eh_boxed
//     refute_satisfied_by "1.3",     "~> 1.4"
//     assert_satisfied_by "1.4",     "~> 1.4"
//     assert_satisfied_by "1.5",     "~> 1.4"
//     refute_satisfied_by "2.0",     "~> 1.4"
//
//     refute_satisfied_by "1.3",     "~> 1.4.4"
//     refute_satisfied_by "1.4",     "~> 1.4.4"
//     assert_satisfied_by "1.4.4",   "~> 1.4.4"
//     assert_satisfied_by "1.4.5",   "~> 1.4.4"
//     refute_satisfied_by "1.5",     "~> 1.4.4"
//     refute_satisfied_by "2.0",     "~> 1.4.4"
//
//     refute_satisfied_by "1.1.pre", "~> 1.0.0"
//     refute_satisfied_by "1.1.pre", "~> 1.1"
//     refute_satisfied_by "2.0.a",   "~> 1.0"
//     refute_satisfied_by "2.0.a",   "~> 2.0"
//
//     refute_satisfied_by "0.9",     "~> 1"
//     assert_satisfied_by "1.0",     "~> 1"
//     assert_satisfied_by "1.1",     "~> 1"
//     refute_satisfied_by "2.0",     "~> 1"
//   end
test('test_satisfied_by_eh_boxed', () => {
  refuteSatisfiedBy('1.3', '~> 1.4');
  assertSatisfiedBy('1.4', '~> 1.4');
  assertSatisfiedBy('1.5', '~> 1.4');
  refuteSatisfiedBy('2.0', '~> 1.4');

  refuteSatisfiedBy('1.3', '~> 1.4.4');
  refuteSatisfiedBy('1.4', '~> 1.4.4');
  assertSatisfiedBy('1.4.4', '~> 1.4.4');
  assertSatisfiedBy('1.4.5', '~> 1.4.4');
  refuteSatisfiedBy('1.5', '~> 1.4.4');
  refuteSatisfiedBy('2.0', '~> 1.4.4');

  refuteSatisfiedBy('1.1.pre', '~> 1.0.0');
  refuteSatisfiedBy('1.1.pre', '~> 1.1');
  refuteSatisfiedBy('2.0.a', '~> 1.0');
  refuteSatisfiedBy('2.0.a', '~> 2.0');

  refuteSatisfiedBy('0.9', '~> 1');
  assertSatisfiedBy('1.0', '~> 1');
  assertSatisfiedBy('1.1', '~> 1');
  refuteSatisfiedBy('2.0', '~> 1');
});

//   def test_satisfied_by_eh_multiple
//     req = [">= 1.4", "<= 1.6", "!= 1.5"]
//
//     refute_satisfied_by "1.3", req
//     assert_satisfied_by "1.4", req
//     refute_satisfied_by "1.5", req
//     assert_satisfied_by "1.6", req
//     refute_satisfied_by "1.7", req
//     refute_satisfied_by "2.0", req
//   end
test('test_satisfied_by_eh_multiple', () => {
  const r = req('>= 1.4', '<= 1.6', '!= 1.5');
  refuteSatisfiedBy('1.3', r);
  assertSatisfiedBy('1.4', r);
  refuteSatisfiedBy('1.5', r);
  assertSatisfiedBy('1.6', r);
  refuteSatisfiedBy('1.7', r);
  refuteSatisfiedBy('2.0', r);
});

//   def test_satisfied_by_boxed
//     refute_satisfied_by "1.3",   "~> 1.4"
//     assert_satisfied_by "1.4",   "~> 1.4"
//     assert_satisfied_by "1.4.0", "~> 1.4"
//     assert_satisfied_by "1.5",   "~> 1.4"
//     refute_satisfied_by "2.0",   "~> 1.4"
//
//     refute_satisfied_by "1.3",   "~> 1.4.4"
//     refute_satisfied_by "1.4",   "~> 1.4.4"
//     assert_satisfied_by "1.4.4", "~> 1.4.4"
//     assert_satisfied_by "1.4.5", "~> 1.4.4"
//     refute_satisfied_by "1.5",   "~> 1.4.4"
//     refute_satisfied_by "2.0",   "~> 1.4.4"
//   end
test('test_satisfied_by_boxed', () => {
  refuteSatisfiedBy('1.3', '~> 1.4');
  assertSatisfiedBy('1.4', '~> 1.4');
  assertSatisfiedBy('1.4.0', '~> 1.4');
  assertSatisfiedBy('1.5', '~> 1.4');
  refuteSatisfiedBy('2.0', '~> 1.4');

  refuteSatisfiedBy('1.3', '~> 1.4.4');
  refuteSatisfiedBy('1.4', '~> 1.4.4');
  assertSatisfiedBy('1.4.4', '~> 1.4.4');
  assertSatisfiedBy('1.4.5', '~> 1.4.4');
  refuteSatisfiedBy('1.5', '~> 1.4.4');
  refuteSatisfiedBy('2.0', '~> 1.4.4');
});

//   def test_satisfied_by_explicitly_bounded
//     req = [">= 1.4.4", "< 1.5"]
//
//     assert_satisfied_by "1.4.5",     req
//     assert_satisfied_by "1.5.0.rc1", req
//     refute_satisfied_by "1.5.0",     req
//
//     req = [">= 1.4.4", "< 1.5.a"]
//
//     assert_satisfied_by "1.4.5",     req
//     refute_satisfied_by "1.5.0.rc1", req
//     refute_satisfied_by "1.5.0",     req
//   end
test('test_satisfied_by_explicitly_bounded', () => {
  let r = req('>= 1.4.4', '< 1.5');
  assertSatisfiedBy('1.4.5', r);
  assertSatisfiedBy('1.5.0.rc1', r);
  refuteSatisfiedBy('1.5.0', r);

  r = req('>= 1.4.4', '< 1.5.a');
  assertSatisfiedBy('1.4.5', r);
  refuteSatisfiedBy('1.5.0.rc1', r);
  refuteSatisfiedBy('1.5.0', r);
});

//   def test_specific
//     refute req('> 1') .specific?
//     refute req('>= 1').specific?
//
//     assert req('!= 1').specific?
//     assert req('< 1') .specific?
//     assert req('<= 1').specific?
//     assert req('= 1') .specific?
//     assert req('~> 1').specific?
//
//     assert req('> 1', '> 2').specific? # GIGO
//   end
test('test_specific', () => {
  expect(req('> 1').isSpecific()).toBe(false);
  expect(req('>= 1').isSpecific()).toBe(false);

  expect(req('!= 1').isSpecific()).toBe(true);
  expect(req('< 1').isSpecific()).toBe(true);
  expect(req('<= 1').isSpecific()).toBe(true);
  expect(req('= 1').isSpecific()).toBe(true);
  expect(req('~> 1').isSpecific()).toBe(true);

  expect(req('> 1', '> 2').isSpecific()).toBe(true);
});

//   def test_bad
//     refute_satisfied_by "",            "> 0.1"
//     refute_satisfied_by "1.2.3",       "!= 1.2.3"
//     refute_satisfied_by "1.2.003.0.0", "!= 1.02.3"
//     refute_satisfied_by "4.5.6",       "< 1.2.3"
//     refute_satisfied_by "1.0",         "> 1.1"
//     refute_satisfied_by "",            "= 0.1"
//     refute_satisfied_by "1.1.1",       "> 1.1.1"
//     refute_satisfied_by "1.2",         "= 1.1"
//     refute_satisfied_by "1.40",        "= 1.1"
//     refute_satisfied_by "1.3",         "= 1.40"
//     refute_satisfied_by "9.3.3",       "<= 9.3.2"
//     refute_satisfied_by "9.3.1",       ">= 9.3.2"
//     refute_satisfied_by "9.3.03",      "<= 9.3.2"
//     refute_satisfied_by "1.0.0.1",     "= 1.0"
//   end
test('test_bad', () => {
  refuteSatisfiedBy('', '> 0.1');
  refuteSatisfiedBy('1.2.3', '!= 1.2.3');
  refuteSatisfiedBy('1.2.003.0.0', '!= 1.02.3');
  refuteSatisfiedBy('4.5.6', '< 1.2.3');
  refuteSatisfiedBy('1.0', '> 1.1');
  refuteSatisfiedBy('', '= 0.1');
  refuteSatisfiedBy('1.1.1', '> 1.1.1');
  refuteSatisfiedBy('1.2', '= 1.1');
  refuteSatisfiedBy('1.40', '= 1.1');
  refuteSatisfiedBy('1.3', '= 1.40');
  refuteSatisfiedBy('9.3.3', '<= 9.3.2');
  refuteSatisfiedBy('9.3.1', '>= 9.3.2');
  refuteSatisfiedBy('9.3.03', '<= 9.3.2');
  refuteSatisfiedBy('1.0.0.1', '= 1.0');
});

//
//   def test_hash_with_multiple_versions
//     r1 = req('1.0', '2.0')
//     r2 = req('2.0', '1.0')
//     assert_equal r1.hash, r2.hash
//
//     r1 = req('1.0', '2.0').tap { |r| r.concat(['3.0']) }
//     r2 = req('3.0', '1.0').tap { |r| r.concat(['2.0']) }
//     assert_equal r1.hash, r2.hash
//   end
//
//   # Assert that two requirements are equal. Handles Gem::Requirements,
//   # strings, arrays, numbers, and versions.

//   def assert_requirement_equal(expected, actual)
//     assert_equal req(expected), req(actual)
//   end
function assertRequirementEqual(expected: any, actual: any) {
  expect(req(actual).eql(req(expected))).toBe(true);
  expect(req(expected).eql(req(actual))).toBe(true);
}

//   # Assert that +version+ satisfies +requirement+.
//
//   def assert_satisfied_by(version, requirement)
//     assert req(requirement).satisfied_by?(v(version)),
//       "#{requirement} is satisfied by #{version}"
//   end
function assertSatisfiedBy(version: unknown, requirement: unknown) {
  expect(req(requirement).isSatisfiedBy(v(version)!)).toBe(true);
}

//   # Refute the assumption that two requirements are equal.

//   def refute_requirement_equal(unexpected, actual)
//     refute_equal req(unexpected), req(actual)
//   end
function refuteRequirementEqual(expected: unknown, actual: unknown) {
  expect(req(actual).eql(req(expected))).toBe(false);
  expect(req(expected).eql(req(actual))).toBe(false);
}

//   # Refute the assumption that +version+ satisfies +requirement+.
//
//   def refute_satisfied_by(version, requirement)
//     refute req(requirement).satisfied_by?(v(version)),
//       "#{requirement} is not satisfied by #{version}"
//   end
function refuteSatisfiedBy(version: unknown, requirement: unknown) {
  expect(req(requirement).isSatisfiedBy(v(version)!)).toBe(false);
}

// end
