const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { JSDOM } = require('jsdom');

module.exports = (filename) => {
  const dom = new JSDOM(fs.readFileSync(path.join(__dirname, '../../data/fandom-card-list.html')));
  const doc = dom.window.document;
  const rows = doc.querySelectorAll('table.card-list > tbody > tr');
  const cards = [];
  let rown = 0;

  for (let row of rows) {
    rown++;
    const card = {};
    const cells = row.querySelectorAll('td');
    if (cells.length !== 9) {
      console.warn('SKIPPING ROW ' + rown + ': UNEXPECTED NUMBER OF CELLS');
      continue;
    }

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const contents = cell.firstChild;
      let data;
      if (contents && contents.nodeName.toLowerCase() === 'a') {
        data = contents.firstChild.nodeValue;
      }
      else if (contents) {
        data = contents.nodeValue;
      }

      if (!data) {
        if (i === 3) {
          card.type = card.cardType;
        }
        else if (i === 8) {
          card.purchasable = false;
        }
        continue;
      }

      switch (i) {
      case 0:
        card.number = Number.parseInt(data);
        break;

      case 1:
        if (card.number === 480) {
          card.name = 'Kuwagata a';
        }
        else if (card.number === 606) {
          card.name = 'Twin Long Rods #2';
        }
        else {
          card.name = data.trim().replace(/\s+/g, ' ');
        }
        break;

      case 2:
        card.cardType = data.trim().replace(/\s+/g,' ');
        break;

      case 3:
        card.type = data.trim().replace(/\s+/g,' ');
        break;

      case 4:
        card.level = Number.parseInt(data.replace(',','').replace(/\s+/g,' '));
        break;

      case 5:
        card.attack = Number.parseInt(data.replace(',','').replace(/\s+/g,' '));
        break;

      case 6:
        card.defense = Number.parseInt(data.replace(',','').replace(/\s+/g,' '));
        break;

      case 7:
        card.password = data.trim().replace(/\s+/g,' ');
        break;

      case 8:
        card.starCost = Number.parseInt(data.replace(',','').replace(/\s+/g,' '));
        card.purchasable = true;
        break;
      }
    }

    cards.push(card);
  }

  fs.writeFileSync(filename, JSON.stringify(cards, null, 2));
};
