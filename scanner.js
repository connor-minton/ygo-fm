class Scanner {
  constructor(buf) {
    this.lines = buf.toString().split('\n');
    this.lineNum = 0;
  }

  hasNextLine() {
    return this.lineNum < this.lines.length;
  }

  getNextLine() {
    if (!this.hasNextLine()) {
      throw new Error('no more lines');
    }
    return this.lines[this.lineNum++];
  }

  back(n) {
    this.lineNum -= n;
    if (!(this.lineNum >= 0 && this.lineNum < this.lines.length)) {
      throw new Error('line number ' + this.lineNum + ' out of bounds');
    }
  }

  forward(n) {
    this.lineNum += n;
    if (!(this.lineNum >= 0 && this.lineNum < this.lines.length)) {
      throw new Error('line number ' + this.lineNum + ' out of bounds');
    }
  }
};

module.exports = Scanner;
