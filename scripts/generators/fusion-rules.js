const fs = require('fs');
const path = require('path');
const Scanner = require('../../scanner');

class FusionRulesParser {
  constructor(buf) {
    this.scanner = new Scanner(buf);
    this.buffer = [];
  }

  getRules() {
    const rules = [];
    while (this.hasNextRule()) {
      rules.push(this.getNextRule());
    }
    return rules;
  }

  _getNextRule() {
    this._advanceToRule();
    const bufCopy = this.buffer.slice();
    this.buffer = [];
    return bufCopy;
  }

  getNextRule() {
    if (!this._advanceToRule())
      return null;

    let equalityLine;

    if (this.buffer.length === 1) {
      equalityLine = this.buffer[0];
    }
    else if (this.buffer.length === 2) {
      equalityLine = this.buffer[0] + this.buffer[1];
    }
    else {
      throw new Error('unexpected buffer length: ' + this.buffer.length);
    }

    const rule = {
      reactants: equalityLine.split(/[+=]/, 2).map(s => s.trim()),
      products: []
    };

    let firstMonBegin = equalityLine.indexOf('=') + 1;
    let firstMonEnd = equalityLine.indexOf('(');
    let attackEnd = equalityLine.indexOf('/', firstMonEnd);
    let attack = 0;

    if (firstMonEnd === -1)
      firstMonEnd = equalityLine.length;
    else
      attack = Number.parseInt(equalityLine.substring(firstMonEnd+1, attackEnd));

    let product = {
      name: equalityLine.substring(firstMonBegin, firstMonEnd).trim(),
      attack: attack,
      lessThan: []
    };

    while (this.scanner.hasNextLine()) {
      const line = this.scanner.getNextLine();
      if (!line || !line.trim())
        break;

      if (line.includes('+')) {
        this.scanner.back(1);
        break;
      }

      let monBegin = line.search(/[a-z]/i);
      let monEnd = line.indexOf('(');
      attackEnd = line.indexOf('/', monEnd);

      if (monEnd === -1)
        monEnd = line.length;
      if (monBegin === -1)
        break;

      const name = line.substring(monBegin, monEnd).trim();

      if (line.trim()[0] === '=') {
        rule.products.push(product);
        product = {
          name: name,
          attack: Number.parseInt(line.substring(monEnd+1, attackEnd)),
          lessThan: []
        };
      }
      else {
        product.lessThan.push(name);
      }
    }

    rule.products.push(product);
    this.buffer = [];

    return rule;
  }

  hasNextRule() {
    return this._advanceToRule();
  }

  _advanceToRule() {
    if (this.buffer.length > 0 && this.buffer[0].includes('+')) {
      return true;
    }

    this.buffer = [];

    while (this.scanner.hasNextLine()) {
      const line = this.scanner.getNextLine();
      this.buffer.push(line);
      if (line.includes('+')) {
        if (line.includes('=')) {
          this.buffer = this.buffer.slice(this.buffer.length-1);
        }
        else {
          this.buffer.push(this.scanner.getNextLine());
          this.buffer = this.buffer.slice(this.buffer.length-2);
        }
        return true;
      }
    }
    return false;
  }
};

module.exports = (filename) => {
  const guideFileName = path.join(__dirname, '../../guides/fusion-rules.txt');
  const parser = new FusionRulesParser(fs.readFileSync(guideFileName));

  const rules = parser.getRules();
  fs.writeFileSync(filename, JSON.stringify(rules, null, 2));
};
