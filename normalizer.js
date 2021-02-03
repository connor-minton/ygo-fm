class Normalizer {
  constructor(ignoreCase = true) {
    this._literals = new Map();
    this._regexes = [];
    this._ignoreCase = ignoreCase;
  }

  /**
   * Equivalent to `addRule(keyword, keyword)`.
   * Adds `keyword` to the list of detected literals. If the Normalizer
   * has `ignoreCase` set, then `keyword` is detected in all case variants
   * and normalized to its exact case as passed to this function.
   */
  addIdentity(keyword) {
    if (typeof keyword !== 'string') {
      throw new Error('keyword must be a string');
    }
    this.addRule(keyword, keyword);
  }

  addRule(pattern, replacement) {
    if (Array.isArray(pattern)) {
      for (let p of pattern) {
        this.addRule(p, replacement);
      }
    }
    else if (typeof pattern === 'string') {
      if (this._ignoreCase)
        pattern = pattern.toLowerCase();
      this._literals.set(pattern, replacement);
    }
    else if (pattern instanceof RegExp) {
      if (this._ignoreCase)
        pattern = new RegExp(pattern, pattern.flags.replace('i','') + 'i');
      this._regexes.push([pattern, replacement]);
    }
    else {
      throw new Error('pattern must be array, string, or RegExp');
    }
  }

  normalize(str) {
    str = String(str);
    if (this._ignoreCase)
      str = str.toLowerCase();

    if (this._literals.has(str)) {
      return this._literals.get(str);
    }

    for (let [pattern, replacement] of this._regexes) {
      if (pattern.test(str))
        return replacement;
    }

    return null;
  }
};

module.exports = Normalizer;
