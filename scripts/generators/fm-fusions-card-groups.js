const fs = require('fs');
const path = require('path');

module.exports = (filename) => {
  const cardGroupsTsv = fs.readFileSync(path.join(__dirname, '../../guides/fm-fusions-card-groups.tsv'));
  const cardGroups = [];
  const tsvLines = cardGroupsTsv.toString().split('\r\n');

  for (let line of tsvLines) {
    if (!line.trim())
      continue;

    const fields = line.split('\t');
    const card = {
      name: fields[0].trim(),
      fusionTypes: []
    };

    for (let i = 1; i < fields.length; i++) {
      card.fusionTypes.push(fields[i].trim());
    }

    cardGroups.push(card);
  }

  fs.writeFileSync(filename, JSON.stringify(cardGroups, null, 2));
};
