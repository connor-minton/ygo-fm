#!/usr/bin/env node

const fs = require('fs');
const RuleResolver = require('./rule-resolver');

const USAGE = 'usage: yfm <handfile>';

if (process.argv.length !== 3) {
  console.error(USAGE);
  process.exit(1);
}

const filename = process.argv[2];

const cardNames = fs.readFileSync(filename).toString()
  .split('\n').map(s => s.trim())
  .filter(s => s);

const res = new RuleResolver();
const fusions = res.getFusions(cardNames);

console.log(JSON.stringify(fusions, null, 2));
