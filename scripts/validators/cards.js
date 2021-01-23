const _ = require('lodash');

let cards;
try {
  cards = require('../../data/cards');
}
catch (e) { }

const MONSTER_TYPES = [
  'Beast Warrior', 'Warrior', 'Aqua',
  'Beast', 'Dinosaur', 'Dragon', 'Fairy', 'Fiend', 'Fish', 'Insect', 'Reptile',
  'Machine', 'Plant', 'Pyro', 'Rock', 'Spellcaster', 'Thunder', 'Winged Beast',
  'Zombie', 'Sea Serpent'
];

const MAGIC_TRAP_TYPES = [
  'Magic', 'Equip Magic', 'Terrain Magic', 'Ritual', 'Trap'
];

const GUARDIAN_STARS = [
  'sun', 'mon', 'vns', 'mrc', 'stn', 'urn', 'plt', 'npt', 'mrs', 'jpt'
];

function makeError(i, card, msg) {
  let errstr = `[${i}]: `;
  if (card && card.number) {
    errstr += `(#${card.number}) `;
  }
  errstr += msg;
  return errstr;
}

function validateMonster(errors, i, card) {
  if (card.attack == null) {
    errors.push(makeError(i, card, 'attack is null or undefined'));
  }
  else if (typeof card.attack !== 'number') {
    errors.push(makeError(i, card, 'attack is not a number'));
  }

  if (card.defense == null) {
    errors.push(makeError(i, card, 'defense is null or undefined'));
  }
  else if (typeof card.defense !== 'number') {
    errors.push(makeError(i, card, 'defense is not a number'));
  }

  if (!Array.isArray(card.guardianStars)) {
    errors.push(makeError(i, card, 'guardianStars is not an array'));
  }
  else if (card.guardianStars.length !== 2) {
    errors.push(makeError(i, card, 'card does not have exactly 2 guardian stars'));
  }
  else {
    for (let gs of card.guardianStars) {
      if (!GUARDIAN_STARS.includes(gs))
        errors.push(makeError(i, card, `unknown guardian star "${gs}"`));
    }
  }
}

function validateMagicTrap(errors, i, card) {
  if (card.attack != null) {
    errors.push(makeError(i, card, 'card is magic/trap but has attack'));
  }
  if (card.defense != null) {
    errors.push(makeError(i, card, 'card is magic/trap but has defense'));
  }

  if (card.guardianStars != null) {
    errors.push(makeError(i, card, 'card is magic/trap but has guardian stars'));
  }
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

  let cardNumGuess = 1;

  for (let i = 0; i < cards.length; i++, cardNumGuess++) {
    const card = cards[i];
    if (card == null) {
      errors.push(makeError(i, card, 'card is null or undefined'));
      continue;
    }

    if (card.number == null) {
      errors.push(makeError(i, card, 'number is null or undefined'));
    }
    else if (typeof card.number !== 'number') {
      errors.push(makeError(i, card, 'number is not a number'));
    }
    else if (cardNumGuess !== card.number) {
      if (cardNumGuess === -1)
        cardNumGuess = card.number;
      else {
        errors.push(makeError(i, card, 'are you missing a card?'));
        cardNumGuess = -2;
      }
    }

    if (MONSTER_TYPES.includes(card.type)) {
      validateMonster(errors, i, card);
    }
    else if (MAGIC_TRAP_TYPES.includes(card.type)) {
      validateMagicTrap(errors, i, card);
    }
    else {
      errors.push(makeError(i, card, `type "${card.type}" is an unknown type`));
    }

    if (!card.password) {
      errors.push(makeError(i, card, 'password is null, undefined, or empty'));
    }
    else if (typeof card.password !== 'string' || card.password.length !== 8) {
      errors.push(makeError(i, card, 'password is defined but does not have exactly 8 characters'));
    }
    else if (_.some(card.password, c => !'0123456789'.includes(c))) {
      errors.push(makeError(i, card, `password "${card.password}" is non-numeric`));
    }
    else if (card.starCost == null) {
      errors.push(makeError(i, card, 'password is defined but starCost is null or undefined'));
    }
    else if (typeof card.starCost !== 'number') {
      errors.push(makeError(i, card, 'starCost is not a number'));
    }
  }

  return errors;
};
