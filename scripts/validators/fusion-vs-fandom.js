/**
 * @module fusion-vs-fandom
 * Verifies that all fusion names can be found in fandom list, case-insensitive.
 */

const fandomCards = require('../../data/fandom-cards.json');
const fusionCards = require('../../data/fusion-card-types-cards.json');
const util = require('../../util');

module.exports = () => {
  const errors = [];

  const fandomNames = new Set();
  const fusionNames = new Set();

  for (let card of fandomCards) {
    fandomNames.add(card.name.toLowerCase());
  }

  for (let card of fusionCards) {
    fusionNames.add(card.name.toLowerCase());
  }

  const missing = util.setDifference(fusionNames, fandomNames);

  for (let name of missing) {
    errors.push('Cannot find fusion card in fandom list: ' + name);
  }

  return errors;
};
