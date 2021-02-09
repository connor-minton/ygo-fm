const util = require('../../util');
let fusionRules, cards;
let cardNames = new Set();

let ruleNum = 0;

function makeError(rule, msg) {
  let error = `[${ruleNum}]: `;
  if (rule && rule.reactants) {
    error += rule.reactants;
  }
  error += ': ' + msg;

  return error;
}

function existsCard(cardName) {
  if (cardNames.size === 0) {
    for (let card of cards) {
      cardNames.add(card.name.toLowerCase());
    }
  }

  if (typeof cardName !== 'string')
    return false;

  return cardNames.has(cardName.toLowerCase());
}

function checkReactant(reactant, rule, errors) {
  if (typeof reactant !== 'string') {
    errors.push(makeError(rule, 'reactant is not a string'));
    return;
  }

  if (reactant[0] === '[') {
    const fusionType = reactant.substring(1, reactant.length - 1);
    if (fusionType !== util.normalizeType(fusionType)) {
      errors.push(makeError(rule, `fusion type "${fusionType}" is not normalized`));
    }
  }
  else if (reactant[0] === '{') {
    const exactReactantListString = reactant.substring(1, reactant.length - 1);
    const exactReactants = exactReactantListString.split(',').map(s => s.trim());
    for (let cardName of exactReactants) {
      if (!existsCard(cardName)) {
        errors.push(makeError(rule, `reactant "${cardName}" does not exist`));
      }
    }
  }
  else {
    if (!existsCard(reactant)) {
      errors.push(makeError(rule, `reactant "${reactant}" does not exist`));
    }
  }
}

function checkReactants(rule, errors) {
  if (!rule.reactants) {
    errors.push(makeError(rule, 'no reactants'));
  }
  else {
    if (rule.reactants.length !== 2) {
      errors.push(makeError(rule, 'number of reactants does not equal 2'));
    }
    for (let reactant of rule.reactants) {
      checkReactant(reactant, rule, errors);
    }
  }
}

function checkProduct(product, rule, errors) {
  if (product == null) {
    errors.push(makeError(rule, 'product is null or undefined'));
    return;
  }

  if (!existsCard(product.name)) {
    errors.push(makeError(rule, `product "${product.name}" does not exist`));
  }
  if (!(product.attack >= 0)) {
    errors.push(makeError(rule, 'product has invalid attack'));
  }

  if (!Array.isArray(product.lessThan)) {
    errors.push(makeError(rule, 'product has invalid lessThan'));
  }
  else {
    for (let cardName of product.lessThan) {
      if (!existsCard(cardName)) {
        errors.push(makeError(rule, `card "${cardName}" in product.lessThan does not exist`));
      }
    }
  }
}

function checkProducts(rule, errors) {
  if (!rule.products || rule.products.length === 0 || !Array.isArray(rule.products)) {
    errors.push(makeError(rule, 'no products'));
  }
  else {
    for (let product of rule.products) {
      checkProduct(product, rule, errors);
    }
  }
}

function validateRule(rule, errors) {
  checkReactants(rule, errors);
  checkProducts(rule, errors);
}

module.exports = () => {
  fusionRules = require('../../data/fusion-rules.json');
  cards = require('../../data/cards.json');

  const errors = [];
  for (let rule of fusionRules) {
    validateRule(rule, errors);
    ruleNum++;
  }
  return errors;
};
