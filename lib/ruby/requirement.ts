/* eslint-disable @typescript-eslint/no-base-to-string */
// https://github.com/ruby/ruby/blob/d4a86e407ec2057c2c7ad757aa76dad757f34c3a/lib/rubygems/requirement.rb

// import { Version } from "./version";

// # frozen_string_literal: true
// require "rubygems/version"
// require "rubygems/deprecate"
//
// ##
// # A Requirement is a set of one or more version restrictions. It supports a
// # few (<tt>=, !=, >, <, >=, <=, ~></tt>) different restriction operators.
// #
// # See Gem::Version for a description on how versions and requirements work
// # together in RubyGems.
//

import { Version } from './version';

export type RawRequirement = Version | string | null;
export type ParsedRequirement = [string, Version];

// TODO: consider richer `eql` semantics
const defaultEql = <T>(x: T, y: T): boolean => x === y;
function uniq<T>(array: T[], eql = defaultEql): T[] {
  return array.filter((x, idx, arr) => arr.findIndex((y) => eql(x, y)) === idx);
}

function reqsEql(
  xReqs: ParsedRequirement[],
  yReqs: ParsedRequirement[],
  eql: (x: ParsedRequirement, y: ParsedRequirement) => boolean,
): boolean {
  if (xReqs.length !== yReqs.length) return false;
  for (let idx = 0; idx < xReqs.length; idx += 1) {
    if (!eql(xReqs[idx], yReqs[idx])) return false;
  }
  return true;
}

const copystr = (x: string): string => (' ' + x).slice(1);

// class Gem::Requirement
//
export class Requirement {
  readonly _requirements: ParsedRequirement[];

  //   OPS = { #:nodoc:
  //     "="  =>  lambda { |v, r| v == r },
  //     "!=" =>  lambda { |v, r| v != r },
  //     ">"  =>  lambda { |v, r| v >  r },
  //     "<"  =>  lambda { |v, r| v <  r },
  //     ">=" =>  lambda { |v, r| v >= r },
  //     "<=" =>  lambda { |v, r| v <= r },
  //     "~>" =>  lambda { |v, r| v >= r && v.release < r.bump }
  //   }.freeze
  //
  //   SOURCE_SET_REQUIREMENT = Struct.new(:for_lockfile).new "!" # :nodoc:
  //
  //   quoted = OPS.keys.map { |k| Regexp.quote k }.join "|"
  //   PATTERN_RAW = "\\s*(#{quoted})?\\s*(#{Gem::Version::VERSION_PATTERN})\\s*".freeze # :nodoc:

  //   ##
  //   # A regular expression that matches a requirement
  //
  //   PATTERN = /\A#{PATTERN_RAW}\z/.freeze
  static PATTERN =
    /^\s*(=|!=|>|<|>=|<=|~>)?\s*([0-9]+(\.[0-9a-zA-Z]+)*(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?)\s*$/;

  //   ##
  //   # The default requirement matches any non-prerelease version

  //   DefaultRequirement = [">=", Gem::Version.new(0)].freeze
  static DEFAULT_REQUIREMENT: ParsedRequirement = ['>=', new Version('0')];

  //   ##
  //   # The default requirement matches any version
  //
  //   DefaultPrereleaseRequirement = [">=", Gem::Version.new("0.a")].freeze
  // static DEFAULT_PRERELEASE_REQUIREMENT: ParsedRequirement = [
  //   '>=',
  //   new Version('0.a'),
  // ];

  //   ##
  //   # Raised when a bad requirement is encountered
  //
  //   class BadRequirementError < ArgumentError; end

  //   ##
  //   # Factory method to create a Gem::Requirement object.  Input may be
  //   # a Version, a String, or nil.  Intended to simplify client code.
  //   #
  //   # If the input is "weird", the default version requirement is
  //   # returned.
  //
  //   def self.create(*inputs)
  //     return new inputs if inputs.length > 1
  //
  //     input = inputs.shift
  //
  //     case input
  //     when Gem::Requirement then
  //       input
  //     when Gem::Version, Array then
  //       new input
  //     when '!' then
  //       source_set
  //     else
  //       if input.respond_to? :to_str
  //         new [input.to_str]
  //       else
  //         default
  //       end
  //     end
  //   end
  static create(...inputs: unknown[]): Requirement {
    if (inputs.length > 1)
      return new Requirement(...(inputs as RawRequirement[]));
    const input = inputs.shift();
    if (input instanceof Requirement) return input;
    if (input instanceof Array)
      return new Requirement(...(input as RawRequirement[]));
    if (input instanceof Version) return new Requirement(input);
    try {
      return new Requirement(copystr(input.toString()));
    } catch {
      return Requirement.default();
    }
  }

  //   def self.default
  //     new '>= 0'
  //   end
  static default(): Requirement {
    return new Requirement('>= 0');
  }

  //   def self.default_prerelease
  //     new '>= 0.a'
  //   end
  //
  //   ###
  //   # A source set requirement, used for Gemfiles and lockfiles
  //
  //   def self.source_set # :nodoc:
  //     SOURCE_SET_REQUIREMENT
  //   end

  //   ##
  //   # Parse +obj+, returning an <tt>[op, version]</tt> pair. +obj+ can
  //   # be a String or a Gem::Version.
  //   #
  //   # If +obj+ is a String, it can be either a full requirement
  //   # specification, like <tt>">= 1.2"</tt>, or a simple version number,
  //   # like <tt>"1.2"</tt>.
  //   #
  //   #     parse("> 1.0")                 # => [">", Gem::Version.new("1.0")]
  //   #     parse("1.0")                   # => ["=", Gem::Version.new("1.0")]
  //   #     parse(Gem::Version.new("1.0")) # => ["=,  Gem::Version.new("1.0")]
  //
  //   def self.parse(obj)
  //     return ["=", obj] if Gem::Version === obj
  //
  //     unless PATTERN =~ obj.to_s
  //       raise BadRequirementError, "Illformed requirement [#{obj.inspect}]"
  //     end
  //
  //     if $1 == ">=" && $2 == "0"
  //       DefaultRequirement
  //     elsif $1 == ">=" && $2 == "0.a"
  //       DefaultPrereleaseRequirement
  //     else
  //       [$1 || "=", Gem::Version.new($2)]
  //     end
  //   end
  static parse(obj: unknown): ParsedRequirement {
    const err = (): void => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Illformed requirement [${obj}]`);
    };

    if (obj instanceof Version) return ['=', obj];

    let objStr;
    try {
      objStr = copystr(obj.toString());
    } catch {
      err();
    }

    const match = objStr.match(Requirement.PATTERN);
    if (!match) err();

    const [, $1, $2] = match;
    return [$1 || '=', new Version($2)];
  }

  //   ##
  //   # An array of requirement pairs. The first element of the pair is
  //   # the op, and the second is the Gem::Version.
  //
  //   attr_reader :requirements #:nodoc:

  //   ##
  //   # Constructs a requirement from +requirements+. Requirements can be
  //   # Strings, Gem::Versions, or Arrays of those. +nil+ and duplicate
  //   # requirements are ignored. An empty set of +requirements+ is the
  //   # same as <tt>">= 0"</tt>.
  //
  //   def initialize(*requirements)
  //     requirements = requirements.flatten
  //     requirements.compact!
  //     requirements.uniq!
  //
  //     if requirements.empty?
  //       @requirements = [DefaultRequirement]
  //     else
  //       @requirements = requirements.map! { |r| self.class.parse r }
  //     end
  //   end
  constructor(...requirements: RawRequirement[]) {
    const flattened = requirements.flat();
    const compacted = flattened.filter((x) => x !== null);
    const unique = uniq(compacted);
    if (unique.length === 0) {
      this._requirements = [Requirement.DEFAULT_REQUIREMENT];
    } else {
      this._requirements = unique.map((r) => Requirement.parse(r));
    }
  }

  //   ##
  //   # Concatenates the +new+ requirements onto this requirement.
  //
  //   def concat(new)
  //     new = new.flatten
  //     new.compact!
  //     new.uniq!
  //     new = new.map { |r| self.class.parse r }
  //
  //     @requirements.concat new
  //   end
  concat(newReqs: RawRequirement[]): void {
    const flattened = newReqs.flat();
    const compacted = flattened.filter((x) => x !== null);
    const unique = uniq(compacted);
    const parsed = unique.map((x) => Requirement.parse(x));
    parsed.forEach((x) => this._requirements.push(x));
  }

  //
  //   ##
  //   # Formats this requirement for use in a Gem::RequestSet::Lockfile.
  //
  //   def for_lockfile # :nodoc:
  //     return if [DefaultRequirement] == @requirements
  //
  //     list = requirements.sort_by do |_, version|
  //       version
  //     end.map do |op, version|
  //       "#{op} #{version}"
  //     end.uniq
  //
  //     " (#{list.join ', '})"
  //   end

  //   ##
  //   # true if this gem has no requirements.
  //
  //   def none?
  //     if @requirements.size == 1
  //       @requirements[0] == DefaultRequirement
  //     else
  //       false
  //     end
  //   end
  isNone(): boolean {
    if (this._requirements.length === 1) {
      const [op, v] = this._requirements[0];
      return (
        op === Requirement.DEFAULT_REQUIREMENT[0] &&
        v.compare(Requirement.DEFAULT_REQUIREMENT[1]) === 0
      );
    }
    return false;
  }

  //   ##
  //   # true if the requirement is for only an exact version
  //
  //   def exact?
  //     return false unless @requirements.size == 1
  //     @requirements[0][0] == "="
  //   end
  //
  //   def as_list # :nodoc:
  //     requirements.map { |op, version| "#{op} #{version}" }
  //   end
  //
  //   def hash # :nodoc:
  //     requirements.sort.hash
  //   end
  //
  //   def marshal_dump # :nodoc:
  //     fix_syck_default_key_in_requirements
  //
  //     [@requirements]
  //   end
  //
  //   def marshal_load(array) # :nodoc:
  //     @requirements = array[0]
  //
  //     fix_syck_default_key_in_requirements
  //   end
  //
  //   def yaml_initialize(tag, vals) # :nodoc:
  //     vals.each do |ivar, val|
  //       instance_variable_set "@#{ivar}", val
  //     end
  //
  //     Gem.load_yaml
  //     fix_syck_default_key_in_requirements
  //   end
  //
  //   def init_with(coder) # :nodoc:
  //     yaml_initialize coder.tag, coder.map
  //   end
  //
  //   def to_yaml_properties # :nodoc:
  //     ["@requirements"]
  //   end
  //
  //   def encode_with(coder) # :nodoc:
  //     coder.add 'requirements', @requirements
  //   end
  //
  //   ##
  //   # A requirement is a prerelease if any of the versions inside of it
  //   # are prereleases

  //   def prerelease?
  //     requirements.any? { |r| r.last.prerelease? }
  //   end
  isPrerelease(): boolean {
    return this._requirements.some(([, ver]) => ver.isPrerelease());
  }

  //   def pretty_print(q) # :nodoc:
  //     q.group 1, 'Gem::Requirement.new(', ')' do
  //       q.pp as_list
  //     end
  //   end

  //   ##
  //   # True if +version+ satisfies this Requirement.
  //
  //   def satisfied_by?(version)
  //     raise ArgumentError, "Need a Gem::Version: #{version.inspect}" unless
  //       Gem::Version === version
  //     # #28965: syck has a bug with unquoted '=' YAML.loading as YAML::DefaultKey
  //     requirements.all? { |op, rv| (OPS[op] || OPS["="]).call version, rv }
  //   end
  isSatisfiedBy(v: Version): boolean {
    return this._requirements.every(([op, r]) => {
      //     "="  =>  lambda { |v, r| v == r },
      //     "!=" =>  lambda { |v, r| v != r },
      //     ">"  =>  lambda { |v, r| v >  r },
      //     "<"  =>  lambda { |v, r| v <  r },
      //     ">=" =>  lambda { |v, r| v >= r },
      //     "<=" =>  lambda { |v, r| v <= r },
      //     "~>" =>  lambda { |v, r| v >= r && v.release < r.bump }
      switch (op) {
        case '=':
          return v.compare(r) === 0;
        case '!=':
          return v.compare(r) !== 0;
        case '>':
          return v.compare(r) === 1;
        case '<':
          return v.compare(r) === -1;
        case '>=':
          return v.compare(r) !== -1;
        case '<=':
          return v.compare(r) !== 1;
        case '~>':
          return v.compare(r) !== -1 && v.release().compare(r.bump()) === -1;
        /* c8 ignore next 2 */
        default:
          return false;
      }
    });
  }

  //   alias :=== :satisfied_by?
  //   alias :=~ :satisfied_by?

  //   ##
  //   # True if the requirement will not always match the latest version.
  //
  //   def specific?
  //     return true if @requirements.length > 1 # GIGO, > 1, > 2 is silly
  //
  //     not %w[> >=].include? @requirements.first.first # grab the operator
  //   end
  isSpecific(): boolean {
    if (this._requirements.length > 1) return true;
    const firstOp = this._requirements[0][0];
    return !(firstOp === '>' || firstOp === '>=');
  }

  //   def to_s # :nodoc:
  //     as_list.join ", "
  //   end

  //   def ==(other) # :nodoc:
  //     return unless Gem::Requirement === other
  //
  //     # An == check is always necessary
  //     return false unless requirements == other.requirements
  //
  //     # An == check is sufficient unless any requirements use ~>
  //     return true unless _tilde_requirements.any?
  //
  //     # If any requirements use ~> we use the stricter `#eql?` that also checks
  //     # that version precision is the same
  //     _tilde_requirements.eql?(other._tilde_requirements)
  //   end
  eql(other: Requirement): boolean {
    if (
      !reqsEql(
        this._requirements,
        other._requirements,
        ([xOp, xVer], [yOp, yVer]) => xOp === yOp && xVer.compare(yVer) === 0,
      )
    ) {
      return false;
    }

    const tildeReqs = this._tildeRequirements();
    if (tildeReqs.length === 0) return true;

    return reqsEql(
      tildeReqs,
      other._tildeRequirements(),
      ([, xVer], [, yVer]) => xVer.strictEql(yVer),
    );
  }

  //   protected
  //
  //   def _tilde_requirements
  //     requirements.select { |r| r.first == "~>" }
  //   end
  _tildeRequirements(): ParsedRequirement[] {
    return this._requirements.filter(([op]) => op === '~>');
  }
  //
  //   private
  //
  //   def fix_syck_default_key_in_requirements # :nodoc:
  //     Gem.load_yaml
  //
  //     # Fixup the Syck DefaultKey bug
  //     @requirements.each do |r|
  //       if r[0].kind_of? Gem::SyckDefaultKey
  //         r[0] = "="
  //       end
  //     end
  //   end
  //
  // end
  //
  // class Gem::Version
  //
  //   # This is needed for compatibility with older yaml
  //   # gemspecs.
  //
  //   Requirement = Gem::Requirement # :nodoc:
  //
  // end
}

export const parse = (obj: unknown) => Requirement.parse(obj);
