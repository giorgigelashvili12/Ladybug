const inquirer = require('inquirer');
const LadybugConfig = require('./config');
const LadybugServer = require('./server');

const updateObj = async (ladybugConfig) => {
  const { errorType } = await inquirer.prompt([{
    type: 'list',
    name: 'errorType',
    message: 'Select error type to edit:',
    choices: Object.keys(ladybugConfig.config)
  }]);

  const selectedError = ladybugConfig.config[errorType];

  const answers = await inquirer.prompt([
    { type: 'input', name: 'msg', message: 'Enter the new error message (leave blank to skip):', default: selectedError.err.msg },
    { type: 'input', name: 'headers', message: 'Enter new headers (JSON format, leave blank to skip):', default: JSON.stringify(selectedError.config.headers) },
    { type: 'input', name: 'data', message: 'Enter new data (e.g., empty or custom JSON, leave blank to skip):', default: selectedError.config.data },
    { type: 'input', name: 'url', message: 'Enter new URL for the error (leave blank to skip):', default: selectedError.config.url },
    { type: 'input', name: 'method', message: 'Enter new HTTP method (leave blank to skip):', default: selectedError.config.method }
  ]);

  ladybugConfig.updateObj(errorType, answers);
  console.log('Updated error object:', JSON.stringify(selectedError, null, 2));
};

const serverConfig = async () => {
  const { serverChoice } = await inquirer.prompt([{
    type: 'list',
    name: 'serverChoice',
    message: 'Select the server configuration to apply:',
    choices: ['Production', 'Staging']
  }]);

  LadybugServer.applyConfig(serverChoice);
};

const menu = async (ladybugConfig) => {
  let exitMenu = false;
  while (!exitMenu) {
    const choices = [
      { name: 'View error object', value: 'view' },
      { name: 'Update error object', value: 'update' },
      { name: 'Apply server config', value: 'apply' },
      { name: 'Save config and continue', value: 'save' },
      { name: 'Exit application', value: 'exit' }
    ];

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: choices
    }]);

    switch (action) {
      case 'view':
        console.log(JSON.stringify(ladybugConfig.config, null, 2));
        break;
      case 'update':
        await updateObj(ladybugConfig);
        break;
      case 'apply':
        await serverConfig();
        break;
      case 'save':
        ladybugConfig.saveConfig();
        console.log('Configuration saved. You can continue with other actions.');
        break;
      case 'exit':
        console.log('Exiting the application...');
        exitMenu = true;
        break;
      default:
        console.log('Invalid choice!');
        break;
    }
  }
};

module.exports = { menu, updateObj, serverConfig };