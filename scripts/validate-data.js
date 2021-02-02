const validators = [
  {
    validate: require('./validators/cards'),
    name: 'cards.json + more-cards.json'
  },
  {
    validate: require('./validators/fandom-card-list'),
    name: 'fandom-card-list.json'
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
