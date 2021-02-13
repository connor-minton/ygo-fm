const cards = require('./data/cards');
const rules = require('./data/fusion-rules');
const util = require('./util');

const cardsByName = initCardsByName();
const rulesByType = initRulesByType(); // reactant -> reactant -> rule

function initCardsByName() {
  const _cardsByName = new Map();
  for (let c of cards) {
    _cardsByName.set(c.name.toLowerCase(), c);
  }
  return _cardsByName;
}

function getCardByName(name) {
  if (typeof name !== 'string')
    return;
  return cardsByName.get(name.toLowerCase());
}

function initRulesByType() {
  const _rulesByType = new Map();

  const _addRule = (r1, r2, rule) => {
    if (!_rulesByType.has(r1)) {
      _rulesByType.set(r1, new Map());
    }
    if (!_rulesByType.get(r1).has(r2)) {
      _rulesByType.get(r1).set(r2, rule);
    }
  };

  // expands {} sets to return [[...leftReactants], [...rightReactants]]
  const _getReactantLists = (reactants) => {
    const lrReactants = [];
    for (let reactant of reactants) {
      if (reactant[0] === '{') {
        const rList = reactant.substring(1, reactant.length - 1);
        lrReactants.push(rList.split(',').map(s => s.trim().toLowerCase()));
      }
      else {
        lrReactants.push([reactant.toLowerCase()]);
      }
    }
    return lrReactants;
  };

  for (let rule of rules) {
    let reactantLists = _getReactantLists(rule.reactants);
    for (let lReact of reactantLists[0]) {
      for (let rReact of reactantLists[1]) {
        _addRule(lReact, rReact, rule);
        _addRule(rReact, lReact, rule);
      }
    }
  }

  return _rulesByType;
}

class RuleResolver {
  /**
   * Returns an array of
   * {
   *   cardName1: string,
   *   cardName2: string,
   *   product: TODO,
   *   rule: Rule
   * }
   */
  getFusions(cardNames) {
    const foundFusions = [];

    for (let i = 0; i < cardNames.length; i++) {
      const cardName = cardNames[i];
      const otherCards = cardNames.slice(i+1);
      for (let fusion of this.getFusionsWithCard(cardName, otherCards)) {
        foundFusions.push(fusion);
      }
    }

    return foundFusions;
  }

  getFusionsWithCard(cardName, otherCardNames) {
    const fusions = [];

    for (let otherCard of otherCardNames) {
      const matchingRules = this.findMatchingRules(cardName, otherCard);
      for (let rule of matchingRules) {
        fusions.push({
          cardName1: cardName,
          cardName2: otherCard,
          rule: rule
        });
      }
    }

    return fusions;
  }

  // returns a rule object (containing the reactants and the products)
  // returns undefined if rule does not exist
  lookupRule(reactantType1, reactantType2) {
    const _reactantType1 = String(reactantType1).toLowerCase();
    const _reactantType2 = String(reactantType2).toLowerCase();

    const type1Rules = rulesByType.get(_reactantType1);

    if (!type1Rules) {
      return;
    }

    return type1Rules.get(_reactantType2);
  }

  // returns a Set of rule objects
  findMatchingRules(cardName1, cardName2) {
    const card1 = getCardByName(cardName1);
    const card2 = getCardByName(cardName2);

    const matchingRules = new Set();
    const fusionTypes1 = util.getFusionTypes(card1);
    const fusionTypes2 = util.getFusionTypes(card2);

    for (let type1 of fusionTypes1) {
      for (let type2 of fusionTypes2) {
        const rule = this.lookupRule(type1, type2);
        if (rule)
          matchingRules.add(rule);
      }
    }

    return matchingRules;
  }
}

module.exports = RuleResolver;
