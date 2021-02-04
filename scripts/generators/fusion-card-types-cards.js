const fs = require('fs');
const path = require('path');

class CardTypesParser {
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

  hasNextCard() {
    this._findNextCard();
    return this._hasNextCard;
  }

  nextCard() {
    this._findNextCard();
    const card = {};

    let [cardName, rhs] = this.lines[this.lineNum].split('|');
    cardName = cardName.trim();
    rhs = rhs.trim();
    card.name = cardName;
    card.types = rhs.split(/\s+/);

    this.lineNum++;
    let line = this.lines[this.lineNum];
    while (this.lineNum < this.lines.length && !line.includes('|')) {
      if (line.trim()) {
        card.types = card.types.concat(line.trim().split(/\s+/));
      }
      this.lineNum++;
      line = this.lines[this.lineNum];
    }

    return card;
  }

  _findNextCard() {
    let line = this.lines[this.lineNum];
    while (this.lineNum < this.lines.length && !line.includes('|')) {
      this.lineNum++;
      line = this.lines[this.lineNum];
    }

    if (this.lineNum >= this.lines.length) {
      this._hasNextCard = false;
      return;
    }

    this._hasNextCard = true;
  }
}

module.exports = (filename) => {
  const cardTypesParser = new CardTypesParser(fs.readFileSync(
    path.join(__dirname, '../../guides/fusion-card-types.txt')
  ));
  const cards = cardTypesParser.getCards();

  fs.writeFileSync(filename, JSON.stringify(cards, null, 2));
};
