const fs = require('fs');
const util = require('../../util');

let fandomCards;
let fandomCardsByName;
let cardGroups;

function isMonster(card) {
  const fandomCard = fandomCardsByName.get(card.name.toLowerCase());
  if (!fandomCard)
    return;
  return fandomCard.cardType === 'Monster';
}

function cardTypeInFusionTypes(card) {
  const fandomCard = fandomCardsByName.get(card.name.toLowerCase());
  if (!fandomCard)
    return;
  const normFusionTypes = card.fusionTypes.map(t => util.normalizeType(t));
  const normType = util.normalizeType(fandomCard.type);

  return normFusionTypes.includes(normType);
}

module.exports = (filename) => {
  cardGroups = require('../../data/fm-fusions-card-groups.json');
  fandomCards = require('../../data/fandom-cards.json');
  fandomCardsByName = new Map(
    fandomCards.map(c => [c.name.toLowerCase(), c])
  );

  const exceptions = [];

  for (let card of cardGroups) {
    if (!cardTypeInFusionTypes(card) && isMonster(card)) {
      exceptions.push(card.name);
    }
  }

  fs.writeFileSync(filename, JSON.stringify(exceptions, null, 2));
};
