let errors = [];

function makeError(i, card, msg) {
  let errstr = `[${i}]: `;
  if (card && card.number) {
    errstr += `(#${card.number}) `;
  }
  errstr += msg;
  return errstr;
}

function checkCardNamesExist(cardGroups, cardNames) {
  for (let i = 0; i < cardGroups.length; i++) {
    const card = cardGroups[i];
    if (!cardNames.has(card.name.toLowerCase())) {
      errors.push(makeError(i, card, `card name "${card.name}" does not exist`));
    }
  }
}

module.exports = () => {
  const fandomCards = require('../../data/fandom-cards.json');
  const cardGroups = require('../../data/fm-fusions-card-groups');
  const cardNames = new Set(fandomCards.map(c => c.name.toLowerCase()));

  errors = [];

  checkCardNamesExist(cardGroups, cardNames);

  return errors;
};
