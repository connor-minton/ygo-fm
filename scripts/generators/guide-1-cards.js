const fs = require('fs');
const path = require('path');
const { titleCase } = require('title-case');

function gsAbbr(fullGuardianStar) {
  const abbrs = {
    su: 'sun',
    mo: 'mon',
    ve: 'vns',
    me: 'mrc',
    sa: 'stn',
    ur: 'urn',
    pl: 'plt',
    ne: 'npt',
    ma: 'mrs',
    ju: 'jpt'
  };

  return abbrs[fullGuardianStar.toLowerCase().substring(0,2)];
}

function normalizeType(inputType) {
  const typeLC = inputType.toLowerCase();
  if (typeLC === 'beastwarrior') {
    return 'Beast Warrior';
  }
  if (typeLC === 'wingedbeast') {
    return 'Winged Beast';
  }
  if (typeLC === 'seaserpent') {
    return 'Sea Serpent';
  }

  return titleCase(inputType);
}

class GuideParser {
  constructor(guide) {
    this.lines = guide.toString().split('\n');
    this.lineNum = 0;
  }

  getCards() {
    const cards = [];

    while (this.hasNextCard()) {
      cards.push(this.nextCard());
    }

    return cards;
  }

  nextCard() {
    this._findNextCard();
    const card = {};

    let lineNum = this.lineNum;
    // first line is always card #
    lineNum += this._addLineToCard(lineNum, card);
    let line;
    do {
      lineNum += this._addLineToCard(lineNum, card);
      line = this.lines[lineNum];
    }
    while (line && line.trim() && !line.startsWith('Card'));

    this.lineNum = lineNum;

    this._findNextCard();

    return card;
  }

  hasNextCard() {
    this._findNextCard();
    return this._hasNextCard;
  }

  // returns num lines to skip
  _addLineToCard(lineNum, card) {
    let line = this.lines[lineNum];
    let skipLines = 1;
    if (line.startsWith('Card #')) {
      const field = line.split(':')[1];
      card.number = Number.parseInt(field);
    }
    else if (line.startsWith('Name')) {
      const field = line.split(':')[1];
      card.name = titleCase(field.trim());
    }
    else if (line.startsWith('Level')) {
      const field = line.split(':')[1];
      card.level = Number.parseInt(field);
    }
    else if (line.startsWith('Type')) {
      const field = line.split(':')[1];
      card.type = normalizeType(field.trim());
    }
    else if (line.startsWith('G.S')) {
      const field = line.split(':')[1];
      card.guardianStars = field.trim().split(/\s+/).map(gs => gsAbbr(gs));
    }
    else if (line.startsWith('Attack')) {
      const [atk, def] = line.split(':')[1].split('/');
      card.attack = Number.parseInt(atk);
      card.defense = Number.parseInt(def);
    }
    else if (line.startsWith('Code')) {
      const [pw, stars] = line.split(':')[1].trim().split(/\s+/);
      if (pw === 'n/a') {
        card.purchasable = false;
      }
      else {
        card.purchasable = true;
        card.password = pw.trim();
        card.starCost = Number.parseInt(stars);
      }
    }
    else if (line.startsWith('Description')) {
      const descLines = [line.split(':').slice(1).join('')];
      let i = 1;
      line = this.lines[lineNum+i];
      while (line && line.trim() && !line.startsWith('Get :')) {
        descLines.push(line);
        i++;
        line = this.lines[lineNum+i];
        skipLines++;
      }
    }

    return skipLines;
  }

  _findNextCard() {
    let line = this.lines[this.lineNum];

    if (this.lineNum === 0) {
      while (this.lineNum < this.lines.length && !line.startsWith('1-100')) {
        this.lineNum++;
        line = this.lines[this.lineNum];
      }
    }

    while (this.lineNum < this.lines.length && !line.startsWith('Card # :')) {
      this.lineNum++;
      line = this.lines[this.lineNum];
    }

    if (this.lineNum >= this.lines.length) {
      this._hasNextCard = false;
    }
    else {
      this._hasNextCard = true;
    }

    return this._hasNextCard;
  }
};

module.exports = (filename) => {
  const guide = new GuideParser(fs.readFileSync(path.join(__dirname, '../../guides/guide-1.txt')));
  const cards = guide.getCards();

  fs.writeFileSync(filename, JSON.stringify(cards, null, 2));
};
