const Normalizer = require('./normalizer');

const typeNorm = new Normalizer();
typeNorm.addIdentity('Aqua');
typeNorm.addIdentity('Beast');
typeNorm.addIdentity('BeastWarrior');
typeNorm.addIdentity('Dinosaur');
typeNorm.addIdentity('Dragon');
typeNorm.addIdentity('Fairy');
typeNorm.addIdentity('Fiend');
typeNorm.addIdentity('Fish');
typeNorm.addIdentity('Insect');
typeNorm.addIdentity('Machine');
typeNorm.addIdentity('Plant');
typeNorm.addIdentity('Pyro');
typeNorm.addIdentity('Reptile');
typeNorm.addIdentity('Rock');
typeNorm.addIdentity('SeaSerpent');
typeNorm.addIdentity('Spellcaster');
typeNorm.addIdentity('Thunder');
typeNorm.addIdentity('Warrior');
typeNorm.addIdentity('WingedBeast');
typeNorm.addIdentity('Zombie');

typeNorm.addIdentity('AngelWinged');
typeNorm.addIdentity('Bugrothian');
typeNorm.addIdentity('Egg');
typeNorm.addIdentity('Elf');
typeNorm.addIdentity('FeatherFromBear');
typeNorm.addIdentity('FeatherFromHarpie');
typeNorm.addIdentity('FeatherFromMachine');
typeNorm.addIdentity('Female');
typeNorm.addIdentity('Koumorian');
typeNorm.addIdentity('Jar');
typeNorm.addIdentity('MercuryMagicUser');
typeNorm.addIdentity('MercurySpellcaster');
typeNorm.addIdentity('Mirror');
typeNorm.addIdentity('MusKingian');
typeNorm.addIdentity('Rainbow');
typeNorm.addIdentity('Sheepian');
typeNorm.addIdentity('Thronian');
typeNorm.addIdentity('Turtle');
typeNorm.addIdentity('UsableBeast');

typeNorm.addIdentity('Magic');
typeNorm.addIdentity('Equip');
typeNorm.addIdentity('Field');
typeNorm.addIdentity('Ritual');
typeNorm.addIdentity('Trap');

typeNorm.addRule(
  ['beast warrior', 'beast-warrior'],
  'BeastWarrior'
);

typeNorm.addRule(
  ['sea serpent', 'sea-serpent'],
  'SeaSerpent'
);

typeNorm.addRule(
  ['winged beast', 'winged-beast'],
  'WingedBeast'
);

typeNorm.addRule('equip magic', 'Equip');
typeNorm.addRule('terrain magic', 'Field');

const gsNorm = new Normalizer();

gsNorm.addIdentity('Sun');
gsNorm.addIdentity('Moon');
gsNorm.addIdentity('Venus');
gsNorm.addIdentity('Mercury');
gsNorm.addIdentity('Saturn');
gsNorm.addIdentity('Uranus');
gsNorm.addIdentity('Pluto');
gsNorm.addIdentity('Neptune');
gsNorm.addIdentity('Mars');
gsNorm.addIdentity('Jupiter');

gsNorm.addRule(['sun', /^su/], 'Sun');
gsNorm.addRule(['mon', /^mo/], 'Moon');
gsNorm.addRule(['vns', /^ve/], 'Venus');
gsNorm.addRule(['mrc', /^me/], 'Mercury');
gsNorm.addRule(['stn', /^sa/], 'Saturn');
gsNorm.addRule(['urn', /^ur/], 'Uranus');
gsNorm.addRule(['plt', /^pl/], 'Pluto');
gsNorm.addRule(['npt', /^ne/], 'Neptune');
gsNorm.addRule(['mrs', /^ma/], 'Mars');
gsNorm.addRule(['jpt', /^ju/], 'Jupiter');

module.exports = {
  normalizeGuardianStar(gs) {
    return gsNorm.normalize(gs);
  },

  normalizeType(type) {
    return typeNorm.normalize(type);
  },

  // returns new set s \ t
  setDifference(s, t) {
    if (!(s instanceof Set))
      s = new Set(s);
    if (!(t instanceof Set))
      t = new Set(t);

    const diff = new Set();
    for (let s_item of s) {
      if (!t.has(s_item)) {
        diff.add(s_item);
      }
    }

    return diff;
  }
};
