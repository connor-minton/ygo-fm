const path = require('path');
const generators = [
  {
    generate: require('./generators/cards'),
    filename: '../data/cards.json'
  },
  {
    generate: require('./generators/fandom-card-list'),
    filename: '../data/fandom-card-list.json'
  }
];

for (let generator of generators) {
  generator.generate(path.join(__dirname, generator.filename));
}
