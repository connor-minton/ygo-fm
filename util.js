module.exports = {
  // returns new set s \ t
  setDifference(s, t) {
    if (!(s instanceof Set))
      s = new Set(s);
    if (!(t instanceof Set))
      t = new Set(t);

    const diff = new Set();
    for (let s_item of s) {
      if (!t.has(s_item)) {
        diff.add(s_item);
      }
    }

    return diff;
  }
};
