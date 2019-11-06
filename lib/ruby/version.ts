/**
 ( from: https://github.com/ruby/ruby/blob/d4a86e407ec2057c2c7ad757aa76dad757f34c3a/lib/rubygems/version.rb )

 * The Version class processes string versions into comparable
 * values. A version string should normally be a series of numbers
 * separated by periods. Each part (digits separated by periods) is
 * considered its own number, and these are used for sorting. So for
 * instance, 3.10 sorts higher than 3.2 because ten is greater than
 * two.
 *
 * If any part contains letters (currently only a-z are supported) then
 * that version is considered prerelease. Versions with a prerelease
 * part in the Nth part sort less than versions with N-1
 * parts. Prerelease parts are sorted alphabetically using the normal
 * Ruby string sorting rules. If a prerelease part contains both
 * letters and numbers, it will be broken into multiple parts to
 * provide expected sort behavior (1.0.a10 becomes 1.0.a.10, and is
 * greater than 1.0.a9).
 *
 * Prereleases sort between real releases (newest to oldest):
 *
 * 1. 1.0
 * 2. 1.0.b1
 * 3. 1.0.a.2
 * 4. 0.9
 *
 * If you want to specify a version restriction that includes both prereleases
 * and regular releases of the 1.x series this is the best way:
 *
 *   s.add_dependency 'example', '>= 1.0.0.a', '< 2.0.0'
 *
 * == How Software Changes
 *
 * Users expect to be able to specify a version constraint that gives them
 * some reasonable expectation that new versions of a library will work with
 * their software if the version constraint is true, and not work with their
 * software if the version constraint is false.  In other words, the perfect
 * system will accept all compatible versions of the library and reject all
 * incompatible versions.
 *
 * Libraries change in 3 ways (well, more than 3, but stay focused here!).
 *
 * 1. The change may be an implementation detail only and have no effect on
 *    the client software.
 * 2. The change may add new features, but do so in a way that client software
 *    written to an earlier version is still compatible.
 * 3. The change may change the public interface of the library in such a way
 *    that old software is no longer compatible.
 *
 * Some examples are appropriate at this point.  Suppose I have a Stack class
 * that supports a <tt>push</tt> and a <tt>pop</tt> method.
 *
 * === Examples of Category 1 changes:
 *
 * * Switch from an array based implementation to a linked-list based
 *   implementation.
 * * Provide an automatic (and transparent) backing store for large stacks.
 *
 * === Examples of Category 2 changes might be:
 *
 * * Add a <tt>depth</tt> method to return the current depth of the stack.
 * * Add a <tt>top</tt> method that returns the current top of stack (without
 *   changing the stack).
 * * Change <tt>push</tt> so that it returns the item pushed (previously it
 *   had no usable return value).
 *
 * === Examples of Category 3 changes might be:
 *
 * * Changes <tt>pop</tt> so that it no longer returns a value (you must use
 *   <tt>top</tt> to get the top of the stack).
 * * Rename the methods to <tt>push_item</tt> and <tt>pop_item</tt>.
 *
 * == RubyGems Rational Versioning
 *
 * * Versions shall be represented by three non-negative integers, separated
 *   by periods (e.g. 3.1.4).  The first integers is the "major" version
 *   number, the second integer is the "minor" version number, and the third
 *   integer is the "build" number.
 *
 * * A category 1 change (implementation detail) will increment the build
 *   number.
 *
 * * A category 2 change (backwards compatible) will increment the minor
 *   version number and reset the build number.
 *
 * * A category 3 change (incompatible) will increment the major build number
 *   and reset the minor and build numbers.
 *
 * * Any "public" release of a gem should have a different version.  Normally
 *   that means incrementing the build number.  This means a developer can
 *   generate builds all day long, but as soon as they make a public release,
 *   the version must be updated.
 *
 * === Examples
 *
 * Let's work through a project lifecycle using our Stack example from above.
 *
 * Version 0.0.1:: The initial Stack class is release.
 * Version 0.0.2:: Switched to a linked=list implementation because it is
 *                 cooler.
 * Version 0.1.0:: Added a <tt>depth</tt> method.
 * Version 1.0.0:: Added <tt>top</tt> and made <tt>pop</tt> return nil
 *                 (<tt>pop</tt> used to return the  old top item).
 * Version 1.1.0:: <tt>push</tt> now returns the value pushed (it used it
 *                 return nil).
 * Version 1.1.1:: Fixed a bug in the linked list implementation.
 * Version 1.1.2:: Fixed a bug introduced in the last fix.
 *
 * Client A needs a stack with basic push/pop capability.  They write to the
 * original interface (no <tt>top</tt>), so their version constraint looks like:
 *
 *   gem 'stack', '>= 0.0'
 *
 * Essentially, any version is OK with Client A.  An incompatible change to
 * the library will cause them grief, but they are willing to take the chance
 * (we call Client A optimistic).
 *
 * Client B is just like Client A except for two things: (1) They use the
 * <tt>depth</tt> method and (2) they are worried about future
 * incompatibilities, so they write their version constraint like this:
 *
 *   gem 'stack', '~> 0.1'
 *
 * The <tt>depth</tt> method was introduced in version 0.1.0, so that version
 * or anything later is fine, as long as the version stays below version 1.0
 * where incompatibilities are introduced.  We call Client B pessimistic
 * because they are worried about incompatible future changes (it is OK to be
 * pessimistic!).
 *
 * == Preventing Version Catastrophe:
 *
 * From: http://blog.zenspider.com/2008/10/rubygems-howto-preventing-cata.html
 *
 * Let's say you're depending on the fnord gem version 2.y.z. If you
 * specify your dependency as ">= 2.0.0" then, you're good, right? What
 * happens if fnord 3.0 comes out and it isn't backwards compatible
 * with 2.y.z? Your stuff will break as a result of using ">=". The
 * better route is to specify your dependency with an "approximate" version
 * specifier ("~>"). They're a tad confusing, so here is how the dependency
 * specifiers work:
 *
 *   Specification From  ... To (exclusive)
 *   ">= 3.0"      3.0   ... &infin;
 *   "~> 3.0"      3.0   ... 4.0
 *   "~> 3.0.0"    3.0.0 ... 3.1
 *   "~> 3.5"      3.5   ... 4.0
 *   "~> 3.5.0"    3.5.0 ... 3.6
 *   "~> 3"        3.0   ... 4.0
 *
 * For the last example, single-digit versions are automatically extended with
 * a zero to give a sensible result.
 */
export class Version {
  static ANCHORED_VERSION_PATTERN = /^\s*([0-9]+(\.[0-9a-zA-Z]+)*(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?)?\s*$/;
  private _version: string = '0';
  private _segments: string[] = [];

  constructor(versionString: string) {
    if (versionString !== undefined && versionString.trim() === '') versionString = '0';
    if (!Version.isCorrect(versionString)) throw new Error(`Malformed version number string ${versionString}`);
    this._version = versionString.replace(/\-/g, '.pre.');
  }

  /**
   * A string representation of this Version.
   */
  get version(): string {
    return this._version;
  }

  /**
   * Alias to version property
   */

  toString(): string {
    return this.version;
  }

  bump(): Version {
    function isInt(str: string) {
      var n = Math.floor(Number(str));
      return n !== Infinity && String(n) === str && n >= 0;
    }

    let segments: string[] = this._version.split('.');
    let newSegments: number[] = [];
    for (let i = 0; i < segments.length; i++) {
      if (isInt(segments[i])) newSegments.push(Number(segments[i])); else break;
    }
    if (newSegments.length > 1) newSegments.pop();
    newSegments[newSegments.length - 1] = newSegments[newSegments.length - 1] + 1;
    return new Version(newSegments.join('.'));
  }

  isEq(other: Version): boolean {
    return other.version == this.version;
  }

  /**
   * True if the +input+ string matches RubyGems' requirements.
   * @param input
   */
  static isCorrect(input: Version | string): boolean {
    let versionString: string = input instanceof Version ? Version.toString() : input;
    return !!Version.ANCHORED_VERSION_PATTERN.test(versionString.toString());
  }

  /**
   Factory method to create a Version object. Input may be a Version
   or a String. Intended to simplify client code.

   ver1 = Version.create('1.3.17')    -> (Version object)
   ver2 = Version.create(ver1)        -> (ver1)
   ver3 = Version.create(nil)         -> nil
   * @param input
   */
  static create(input: string | Version): Version {
    if (input === null) return null;
    let versionString: string = input instanceof Version ? Version.toString() : input;
    return new Version(versionString);

  }


}

