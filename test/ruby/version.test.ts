// https://github.com/ruby/ruby/blob/d4a86e407ec2057c2c7ad757aa76dad757f34c3a/test/rubygems/test_gem_version.rb

import { create, Version } from '../../lib/ruby/version';

const v = (x: string) => Version.create(x);

// ...
//
// class TestGemVersion < Gem::TestCase
//
//   ...

//   def test_bump
//     assert_bumped_version_equal "5.3", "5.2.4"
//   end
test('test_bump', () => {
  assertBumpedVersionEqual('5.3', '5.2.4');
});

//   def test_bump_alpha
//     assert_bumped_version_equal "5.3", "5.2.4.a"
//   end
test('test_bump_alpha', () => {
  assertBumpedVersionEqual('5.3', '5.2.4.a');
});

//   def test_bump_alphanumeric
//     assert_bumped_version_equal "5.3", "5.2.4.a10"
//   end
test('test_bump_alphanumeric', () => {
  assertBumpedVersionEqual('5.3', '5.2.4.a10');
});

//   def test_bump_trailing_zeros
//     assert_bumped_version_equal "5.1", "5.0.0"
//   end
test('test_bump_trailing_zeros', () => {
  assertBumpedVersionEqual('5.1', '5.0.0');
});

//   def test_bump_one_level
//     assert_bumped_version_equal "6", "5"
//   end
test('test_bump_one_level', () => {
  assertBumpedVersionEqual('6', '5');
});

//   # A Gem::Version is already a Gem::Version and therefore not transformed by
//   # Gem::Version.create
//
//   def test_class_create
//     real = Gem::Version.new(1.0)
//
//     assert_same  real, Gem::Version.create(real)
//     assert_nil   Gem::Version.create(nil)
//     assert_equal v("5.1"), Gem::Version.create("5.1")
//
//     ver = '1.1'.freeze
//     assert_equal v('1.1'), Gem::Version.create(ver)
//   end
test('test_class_create', () => {
  const real = new Version(1.0);
  expect(Version.create(real)).toBe(real);
  expect(Version.create(null)).toBeNull();
  expect(create(null)).toBeNull();
});

//   def test_class_correct
//     assert_equal true,  Gem::Version.correct?("5.1")
//     assert_equal false, Gem::Version.correct?("an incorrect version")
//
//     expected = "nil versions are discouraged and will be deprecated in Rubygems 4\n"
//     assert_output nil, expected do
//       Gem::Version.correct?(nil)
//     end
//   end
test('test_class_correct', () => {
  expect(Version.isCorrect(5.1)).toBe(true);
  expect(Version.isCorrect('5.1')).toBe(true);
  expect(Version.isCorrect('an incorrect version')).toBe(false);
  expect(Version.isCorrect(null)).toBe(false);
});

//
//   def test_class_new_subclass
//     v1 = Gem::Version.new '1'
//     v2 = V.new '1'
//
//     refute_same v1, v2
//   end
//

//   def test_eql_eh
//     assert_version_eql "1.2",    "1.2"
//     refute_version_eql "1.2",    "1.2.0"
//     refute_version_eql "1.2",    "1.3"
//     refute_version_eql "1.2.b1", "1.2.b.1"
//   end
test('test_eql_eh', () => {
  assertVersionEql('1.2', '1.2');
  refuteVersionEql('1.2', '1.2.0');
  refuteVersionEql('1.2', '1.3');
  refuteVersionEql('1.2.b1', '1.2.b.1');
});

//   def test_equals2
//     assert_version_equal "1.2",    "1.2"
//     refute_version_equal "1.2",    "1.3"
//     assert_version_equal "1.2.b1", "1.2.b.1"
//   end
test('test_equals2', () => {
  assertVersionEqual('1.2', '1.2');
  refuteVersionEqual('1.2', '1.3');
  assertVersionEqual('1.2.b1', '1.2.b.1');
});

//   # REVISIT: consider removing as too impl-bound
//   def test_hash
//     assert_equal v("1.2").hash, v("1.2").hash
//     refute_equal v("1.2").hash, v("1.3").hash
//     assert_equal v("1.2").hash, v("1.2.0").hash
//     assert_equal v("1.2.pre.1").hash, v("1.2.0.pre.1.0").hash
//   end
//

//   def test_initialize
//     ["1.0", "1.0 ", " 1.0 ", "1.0\n", "\n1.0\n", "1.0".freeze].each do |good|
//       assert_version_equal "1.0", good
//     end
//
//     assert_version_equal "1", 1
//   end
test('test_initialize', () => {
  ['1.0', '1.0 ', ' 1.0 ', '1.0\n', '\n1.0\n', '1.0'].forEach((good) => {
    assertVersionEqual('1.0', good);
  });
});

//   def test_initialize_invalid
//     invalid_versions = %W[
//       junk
//       1.0\n2.0
//       1..2
//       1.2\ 3.4
//     ]
//
//     # DON'T TOUCH THIS WITHOUT CHECKING CVE-2013-4287
//     invalid_versions << "2.3422222.222.222222222.22222.ads0as.dasd0.ddd2222.2.qd3e."
//
//     invalid_versions.each do |invalid|
//       e = assert_raises ArgumentError, invalid do
//         Gem::Version.new invalid
//       end
//
//       assert_equal "Malformed version number string #{invalid}", e.message, invalid
//     end
//   end
test('test_initialize_invalid', () => {
  const invalidVersions = [
    'junk',
    '1.0\\n2.0',
    '1..2',
    '1.2\\ 3.4',
    '2.3422222.222.222222222.22222.ads0as.dasd0.ddd2222.2.qd3e.',
  ];

  invalidVersions.forEach((invalid) => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Version(invalid);
    }).toThrow(`Malformed version number string ${invalid}`);
  });
});

//   def bench_anchored_version_pattern
//     assert_performance_linear 0.5 do |count|
//       version_string = count.times.map {|i| "0" * i.succ }.join(".") << "."
//       version_string =~ Gem::Version::ANCHORED_VERSION_PATTERN
//     end
//   rescue RegexpError
//     skip "It fails to allocate the memory for regex pattern of Gem::Version::ANCHORED_VERSION_PATTERN"
//   end

//   def test_empty_version
//     ["", "   ", " "].each do |empty|
//       assert_equal "0", Gem::Version.new(empty).version
//     end
//   end
test('test_empty_version', () => {
  ['', '   ', ' '].forEach((empty) => {
    expect(v(empty).version()).toBe('0');
  });
});

//   def test_prerelease
//     assert_prerelease "1.2.0.a"
//     assert_prerelease "2.9.b"
//     assert_prerelease "22.1.50.0.d"
//     assert_prerelease "1.2.d.42"
//
//     assert_prerelease '1.A'
//
//     assert_prerelease '1-1'
//     assert_prerelease '1-a'
//
//     refute_prerelease "1.2.0"
//     refute_prerelease "2.9"
//     refute_prerelease "22.1.50.0"
//   end
test('test_prerelease', () => {
  expect(v('1.2.0.a').isPrerelease()).toBe(true);
  expect(v('2.9.b').isPrerelease()).toBe(true);
  expect(v('22.1.50.0.d').isPrerelease()).toBe(true);
  expect(v('1.2.d.42').isPrerelease()).toBe(true);

  expect(v('1.A').isPrerelease()).toBe(true);

  expect(v('1-1').isPrerelease()).toBe(true);
  expect(v('1-a').isPrerelease()).toBe(true);

  expect(v('1.2.0').isPrerelease()).toBe(false);
  expect(v('2.9').isPrerelease()).toBe(false);
  expect(v('22.1.50.0').isPrerelease()).toBe(false);
});

//   def test_release
//     assert_release_equal "1.2.0", "1.2.0.a"
//     assert_release_equal "1.1",   "1.1.rc10"
//     assert_release_equal "1.9.3", "1.9.3.alpha.5"
//     assert_release_equal "1.9.3", "1.9.3"
//   end
test('test_release', () => {
  assertReleaseEqual('1.2.0', '1.2.0.a');
  assertReleaseEqual('1.1', '1.1.rc10');
  assertReleaseEqual('1.9.3', '1.9.3.alpha.5');
  assertReleaseEqual('1.9.3', '1.9.3');
});

//   def test_spaceship
//     assert_equal(0, v("1.0")       <=> v("1.0.0"))
//     assert_equal(1, v("1.0")       <=> v("1.0.a"))
//     assert_equal(1, v("1.8.2")     <=> v("0.0.0"))
//     assert_equal(1, v("1.8.2")     <=> v("1.8.2.a"))
//     assert_equal(1, v("1.8.2.b")   <=> v("1.8.2.a"))
//     assert_equal(-1, v("1.8.2.a") <=> v("1.8.2"))
//     assert_equal(1, v("1.8.2.a10") <=> v("1.8.2.a9"))
//     assert_equal(0, v("")          <=> v("0"))
//
//     assert_equal(0, v("0.beta.1")  <=> v("0.0.beta.1"))
//     assert_equal(-1, v("0.0.beta")  <=> v("0.0.beta.1"))
//     assert_equal(-1, v("0.0.beta")  <=> v("0.beta.1"))
//
//     assert_equal(-1, v("5.a") <=> v("5.0.0.rc2"))
//     assert_equal(1, v("5.x") <=> v("5.0.0.rc2"))
//
//     assert_nil v("1.0") <=> "whatever"
//   end
test('test_spaceship', () => {
  assertVersionOrder('1.0', '1.0.0', 0);

  assertVersionOrder('1.0', '1.0.a', 1);
  assertVersionOrder('1.8.2', '0.0.0', 1);
  assertVersionOrder('1.8.2', '1.8.2.a', 1);
  assertVersionOrder('1.8.2.b', '1.8.2.a', 1);
  assertVersionOrder('1.8.2.a', '1.8.2', -1);
  assertVersionOrder('1.8.2.a10', '1.8.2.a9', 1);
  assertVersionOrder('', '0', 0);

  assertVersionOrder('0.beta.1', '0.0.beta.1', 0);
  assertVersionOrder('0.0.beta', '0.0.beta.1', -1);
  assertVersionOrder('0.0.beta', '0.beta.1', -1);

  assertVersionOrder('5.a', '5.0.0.rc2', -1);
  assertVersionOrder('5.x', '5.0.0.rc2', 1);

  expect(v('1.0').compare(v('whatever'))).toBeNull();
});

//   def test_approximate_recommendation
//     assert_approximate_equal "~> 1.0", "1"
//     assert_approximate_satisfies_itself "1"
//
//     assert_approximate_equal "~> 1.0", "1.0"
//     assert_approximate_satisfies_itself "1.0"
//
//     assert_approximate_equal "~> 1.2", "1.2"
//     assert_approximate_satisfies_itself "1.2"
//
//     assert_approximate_equal "~> 1.2", "1.2.0"
//     assert_approximate_satisfies_itself "1.2.0"
//
//     assert_approximate_equal "~> 1.2", "1.2.3"
//     assert_approximate_satisfies_itself "1.2.3"
//
//     assert_approximate_equal "~> 1.2.a", "1.2.3.a.4"
//     assert_approximate_satisfies_itself "1.2.3.a.4"
//
//     assert_approximate_equal "~> 1.9.a", "1.9.0.dev"
//     assert_approximate_satisfies_itself "1.9.0.dev"
//   end
test('test_approximate_recommendation', () => {
  assertApproximateEqual('~> 1.0', '1');
  assertApproximateEqual('~> 1.0', '1.0');
  assertApproximateEqual('~> 1.2', '1.2');
  assertApproximateEqual('~> 1.2', '1.2.0');
  assertApproximateEqual('~> 1.2', '1.2.3');
  assertApproximateEqual('~> 1.2.a', '1.2.3.a.4');
  assertApproximateEqual('~> 1.9.a', '1.9.0.dev');
});

//   def test_to_s
//     assert_equal "5.2.4", v("5.2.4").to_s
//   end
test('test_to_s', () => {
  expect(v('5.2.4').toString()).toBe('5.2.4');
});

//   def test_semver
//     assert_less_than "1.0.0-alpha", "1.0.0-alpha.1"
//     assert_less_than "1.0.0-alpha.1", "1.0.0-beta.2"
//     assert_less_than "1.0.0-beta.2", "1.0.0-beta.11"
//     assert_less_than "1.0.0-beta.11", "1.0.0-rc.1"
//     assert_less_than "1.0.0-rc1", "1.0.0"
//     assert_less_than "1.0.0-1", "1"
//   end
test('test_semver', () => {
  assertLessThan('1.0.0-alpha', '1.0.0-alpha.1');
  assertLessThan('1.0.0-alpha.1', '1.0.0-beta.2');
  assertLessThan('1.0.0-beta.2', '1.0.0-beta.11');
  assertLessThan('1.0.0-beta.11', '1.0.0-rc.1');
  assertLessThan('1.0.0-rc1', '1.0.0');
  assertLessThan('1.0.0-1', '1');
});

//   # modifying the segments of a version should not affect the segments of the cached version object
//   def test_segments
//     v('9.8.7').segments[2] += 1
//
//     refute_version_equal "9.8.8", "9.8.7"
//     assert_equal         [9,8,7], v("9.8.7").segments
//   end

//   def test_canonical_segments
//     assert_equal [1], v("1.0.0").canonical_segments
//     assert_equal [1, "a", 1], v("1.0.0.a.1.0").canonical_segments
//     assert_equal [1, 2, 3, "pre", 1], v("1.2.3-1").canonical_segments
//   end
test('test_canonical_segments', () => {
  expect(v('1.0.0').canonicalSegments()).toEqual([1]);
  expect(v('1.0.0.a.1.0').canonicalSegments()).toEqual([1, 'a', 1]);
  expect(v('1.2.3-1').canonicalSegments()).toEqual([1, 2, 3, 'pre', 1]);

  expect(v('1.2.3-1').splitSegments()).toEqual([
    [1, 2, 3],
    ['pre', 1],
  ]);
});

//   # Asserts that +version+ is a prerelease.
//
//   def assert_prerelease(version)
//     assert v(version).prerelease?, "#{version} is a prerelease"
//   end

//   # Assert that +expected+ is the "approximate" recommendation for +version+.
//
//   def assert_approximate_equal(expected, version)
//     assert_equal expected, v(version).approximate_recommendation
//   end
function assertApproximateEqual(expected: string, version: string) {
  expect(v(version).approximateRecommendation().toString()).toEqual(expected);
}

//   # Assert that the "approximate" recommendation for +version+ satifies +version+.
//
//   def assert_approximate_satisfies_itself(version)
//     gem_version = v(version)
//
//     assert Gem::Requirement.new(gem_version.approximate_recommendation).satisfied_by?(gem_version)
//   end
//

//   # Assert that bumping the +unbumped+ version yields the +expected+.
//
//   def assert_bumped_version_equal(expected, unbumped)
//     assert_version_equal expected, v(unbumped).bump
//   end
function assertBumpedVersionEqual(expected: string, unbumped: string) {
  assertVersionEqual(expected, v(unbumped).bump().toString());
}

//   # Assert that +release+ is the correct non-prerelease +version+.
//
//   def assert_release_equal(release, version)
//     assert_version_equal release, v(version).release
//   end
function assertReleaseEqual(release: string, version: string) {
  assertVersionEqual(release, v(version).release().toString());
}

//   # Assert that two versions are equal. Handles strings or
//   # Gem::Version instances.
//   def assert_version_equal(expected, actual)
//     assert_equal v(expected), v(actual)
//     assert_equal v(expected).hash, v(actual).hash, "since #{actual} == #{expected}, they must have the same hash"
//   end
function assertVersionEqual(expected: string, actual: string) {
  expect(v(expected).compare(v(actual))).toBe(0);
}
function assertVersionOrder(expected: string, actual: string, value: number) {
  expect(v(expected).compare(v(actual))).toEqual(value);
  expect(v(actual).compare(v(expected))).toEqual(value === 0 ? 0 : -value);
}

//   # Assert that two versions are eql?. Checks both directions.
//   def assert_version_eql(first, second)
//     first, second = v(first), v(second)
//     assert first.eql?(second), "#{first} is eql? #{second}"
//     assert second.eql?(first), "#{second} is eql? #{first}"
//   end
function assertVersionEql(firstStr: string, secondStr: string) {
  const [first, second] = [v(firstStr), v(secondStr)];
  expect(first.strictEql(second)).toBe(true);
  expect(second.strictEql(first)).toBe(true);
}

//   def assert_less_than(left, right)
//     l = v(left)
//     r = v(right)
//     assert l < r, "#{left} not less than #{right}"
//   end
function assertLessThan(left: string, right: string) {
  assertVersionOrder(left, right, -1);
}

//   # Refute the assumption that +version+ is a prerelease.
//
//   def refute_prerelease(version)
//     refute v(version).prerelease?, "#{version} is NOT a prerelease"
//   end
//

//   # Refute the assumption that two versions are eql?. Checks both
//   # directions.
//
//   def refute_version_eql(first, second)
//     first, second = v(first), v(second)
//     refute first.eql?(second), "#{first} is NOT eql? #{second}"
//     refute second.eql?(first), "#{second} is NOT eql? #{first}"
//   end
function refuteVersionEql(firstStr: string, secondStr: string) {
  const [first, second] = [v(firstStr), v(secondStr)];
  expect(first.strictEql(second)).toBe(false);
  expect(second.strictEql(first)).toBe(false);
}

//   # Refute the assumption that the two versions are equal?.
//
//   def refute_version_equal(unexpected, actual)
//     refute_equal v(unexpected), v(actual)
//   end
function refuteVersionEqual(unexpected: string, actual: string) {
  expect(v(unexpected).compare(v(actual))).not.toBe(0);
}

// end
