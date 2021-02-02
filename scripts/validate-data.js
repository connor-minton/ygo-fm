const validators = [
  {
    validate: require('./validators/guide-1-cards'),
    name: 'guide-1-cards.json'
  },
  {
    validate: require('./validators/fandom-cards'),
    name: 'fandom-cards.json'
  },
  {
    validate: require('./validators/fusion-vs-fandom'),
    name: 'fusion names in fandom'
  }
];

for (let validator of validators) {
  const errors = validator.validate();
  if (errors.length === 0) {
    console.log(`Validator "${validator.name}" did not report errors.`);
  }
  else {
    console.log(`Validator "${validator.name}" ERRORS:`);
    for (let error of errors) {
      console.log(`  - ${error}`);
    }
  }
}
