const fs = require ('fs');
const fileContents = fs.readFileSync('input.txt', 'utf-8');

const data = fileContents.split('\n');
const rules = data.slice(0, data.findIndex( (line) => line === ''));
const updates = data.slice(data.findIndex((line) => line === '') + 1);
const p2 = [];

const validateRule = (updateEntry, updateRow) => {
  const relevantRules = rules.filter((rule) => {
    const r = rule.split('|');
    return r.includes(updateEntry);
  });
  let isValid = true;
  for (const rule of relevantRules) {
    const r = rule.split('|');
    const first = r[0];
    const second = r[1];
    const firstIndex = updateRow.indexOf(first);
    const secondIndex = updateRow.indexOf(second);
    if ((firstIndex >=0 && secondIndex >=0) && firstIndex > secondIndex) {
      isValid = false;
    }
  }

  return isValid;
};

const validUpdates = updates.filter((update) => {
  const row = update.split(',');
  let isValid = true;
  const rules = [];
  for(const entry of row) {
    const result = validateRule(entry, row);
    isValid = isValid && result;
  }
  return isValid;
});


const middleElements = validUpdates.map((update) => {
  const arr = update.split(',');
  return arr[Math.floor(arr.length / 2)];
});

const sum = middleElements.reduce((acc, curr) => acc + parseInt(curr), 0);
console.log('Part 1:', sum);

let sum2 = 0;
updates.forEach((update) => {
  const row = update.split(',');
  const relevantRules = rules.filter((rule) => {
    const r = rule.split('|');
    const first = r[0];
    const second = r[1];
    const firstIndex = row.indexOf(first);
    const secondIndex = row.indexOf(second);
    if ((firstIndex >=0 && secondIndex >=0) && firstIndex > secondIndex) {
      return true
    }
  });
  for(const rule of relevantRules.reverse()) {
    const r = rule.split('|');
    const first = r[0];
    const second = r[1];
    const firstIndex = row.indexOf(first);
    const secondIndex = row.indexOf(second);
    if ((firstIndex >=0 && secondIndex >=0) && firstIndex > secondIndex) {
      const temp = row[firstIndex];
      row[firstIndex] = row[secondIndex];
      row[secondIndex] = temp;
    }
  }
  if (relevantRules.length > 0) {
    sum2 += parseInt(row[Math.floor(row.length / 2)]);
  }
});

console.log("Part2:", sum2);
