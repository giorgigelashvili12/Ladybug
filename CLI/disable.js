const fs = require('fs');
const ladybugConfig = require('../config/ladybugConfig.json');

exports.disable = () => {
  ladybugConfig.enabled = false;
  fs.writeFileSync('./ladybugConfig.json', JSON.stringify(ladybugConfig, null, 2));
  console.log('Ladybug CLI is disabled.');
};