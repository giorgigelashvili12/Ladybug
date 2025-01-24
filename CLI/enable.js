const fs = require('fs');
const ladybugConfig = require('../config/ladybugConfig.json');

exports.enable = () => {
  ladybugConfig.enabled = true;
  fs.writeFileSync('./ladybugConfig.json', JSON.stringify(ladybugConfig, null, 2));
  console.log('Ladybug CLI is enabled.');
};