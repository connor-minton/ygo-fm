const path = require('path');
const generators = [
  {
    generate: require('./generators/guide-1-cards'),
    filename: 'guide-1-cards.json'
  },
  {
    generate: require('./generators/fusion-card-types-cards'),
    filename: 'fusion-card-types-cards.json'
  },
  {
    generate: require('./generators/fandom-cards'),
    filename: 'fandom-cards.json'
  },
  {
    generate: require('./generators/fm-fusions-card-groups'),
    filename: 'fm-fusions-card-groups.json'
  },
  {
    generate: require('./generators/same-type-exceptions'),
    filename: 'same-type-exceptions.json'
  },
  {
    generate: require('./generators/cards'),
    filename: 'cards.json'
  },
  {
    generate: require('./generators/fusion-rules'),
    filename: 'fusion-rules.json'
  }
];

for (let generator of generators) {
  console.log('Generating ' + generator.filename + '...');
  generator.generate(path.join(__dirname, '../data', generator.filename));
}
