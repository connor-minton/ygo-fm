let errors = [];
let fandomCards;
let fandomCardNames;
let exceptions;

function makeError(i, card, msg) {
  let errstr = `[${i}]: `;
  if (card && card.number) {
    errstr += `(#${card.number}) `;
  }
  errstr += msg;
  return errstr;
}

function checkCardsExist() {
  for (let i = 0; i < exceptions.length; i++) {
    const cardName = exceptions[i];
    if (!fandomCardNames.has(cardName.toLowerCase())) {
      errors.push(makeError(i, null, `card "${cardName}" does not exist`));
    }
  }
}

module.exports = () => {
  fandomCards = require('../../data/fandom-cards');
  fandomCardNames = new Set(
    fandomCards.map(c => c.name.toLowerCase())
  );
  exceptions = require('../../data/same-type-exceptions');
  errors = [];

  checkCardsExist();

  return errors;
};
