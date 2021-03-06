/**
 * @module cards
 * Merges card data into one file.
 */

const fs = require('fs');
const _ = require('lodash');

module.exports = (filename) => {
  const fandomCards = require('../../data/fandom-cards');
  const guideCards = require('../../data/guide-1-cards');
  const fusionCards = require('../../data/fusion-card-types-cards');
  const sameTypeExceptions = new Set(require('../../data/same-type-exceptions.json')
    .map(s => s.toLowerCase())
  );

  const fusionCardsByName = _(fusionCards)
    .groupBy('name')
    .mapValues(_.first)
    .mapKeys((v,k) => k.toLowerCase())
    .value();

  const guideCardsByNo = _(guideCards)
    .groupBy('number')
    .mapValues(_.first)
    .value();

  function getExtraTypes(cardName) {
    const card = fusionCardsByName[cardName.toLowerCase()];
    if (card) {
      return card.types;
    }

    return [];
  }

  function getGuardianStars(cardNo) {
    const card = guideCardsByNo[cardNo];
    return card.guardianStars || null;
  }

  const cards = _.cloneDeep(fandomCards);

  for (let card of cards) {
    // FUSION TYPES

    const extraTypes = getExtraTypes(card.name);
    let fusionTypes;
    if (card.cardType === 'Monster' && !extraTypes.includes(card.type) && !sameTypeExceptions.has(card.name.toLowerCase())) {
      fusionTypes = [card.type, ...extraTypes];
    }
    else {
      fusionTypes = extraTypes;
    }

    card.fusionTypes = fusionTypes;

    // GUARDIAN STARS

    const guardianStars = getGuardianStars(card.number);
    if (guardianStars) {
      card.guardianStars = guardianStars;
    }
  }

  fs.writeFileSync(filename, JSON.stringify(cards, null, 2));
};
