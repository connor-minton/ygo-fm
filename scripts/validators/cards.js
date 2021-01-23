let cards;
try {
  cards = require('../../data/cards');
}
catch (e) { }

function makeError(i, msg) {
  return `[${i}]: ${msg}`;
}

module.exports = () => {
  const errors = [];

  if (typeof cards === 'undefined') {
    errors.push('could not locate data');
    return errors;
  }
  if (!Array.isArray(cards)) {
    errors.push('cards is not an array');
    return errors;
  }

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (card == null) {
      errors.push(makeError('card is null or undefined'));
      continue;
    }
  }

  return errors;
};
