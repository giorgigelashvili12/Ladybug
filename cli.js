const inquirer = require('inquirer');
const fs = require('fs');

const lcf = (filename = './error/v1/v1.json') => {
  if (fs.existsSync(filename)) {
    const configData = fs.readFileSync(filename);
    return JSON.parse(configData);
  } else {
    console.log(`File ${filename} does not exist.`);
    return null;
  }
};

const sc = (config, filename = './error/v1/v1.json') => {
  fs.writeFileSync(filename, JSON.stringify(config, null, 2));
  console.log(`Config saved to ${filename}`);
};

const uej = async (errorObject) => {
  const { errorType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'errorType',
      message: 'Select error type to edit:',
      choices: Object.keys(errorObject)
    }
  ]);

  const selectedError = errorObject[errorType];

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'msg',
      message: 'Enter the new error message (leave blank to skip):',
      default: selectedError.err.msg
    },
    {
      type: 'input',
      name: 'headers',
      message: 'Enter new headers (JSON format, leave blank to skip):',
      default: JSON.stringify(selectedError.config.headers)
    },
    {
      type: 'input',
      name: 'data',
      message: 'Enter new data (e.g., empty or custom JSON, leave blank to skip):',
      default: selectedError.config.data
    },
    {
      type: 'input',
      name: 'url',
      message: 'Enter new URL for the error (leave blank to skip):',
      default: selectedError.config.url
    },
    {
      type: 'input',
      name: 'method',
      message: 'Enter new HTTP method (leave blank to skip):',
      default: selectedError.config.method
    }
  ]);

  if (answers.msg) selectedError.err.msg = answers.msg;
  if (answers.headers) selectedError.config.headers = JSON.parse(answers.headers);
  if (answers.data) selectedError.config.data = answers.data;
  if (answers.url) selectedError.config.url = answers.url;
  if (answers.method) selectedError.config.method = answers.method;

  console.log('Updated error object:', JSON.stringify(selectedError, null, 2));
};

const ac = async () => {
  const { serverChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'serverChoice',
      message: 'Select the server configuration to apply:',
      choices: ['Production', 'Staging']
    }
  ]);

  console.log(`Applying server config: ${serverChoice}`);

  console.log(`Server config ${serverChoice} applied.`);
};

const menu = async (errorObject) => {
  const choices = [
    { name: 'View error object', value: 'view' },
    { name: 'Update error object', value: 'update' },
    { name: 'Apply server config', value: 'apply' },
    { name: 'Save and exit', value: 'save' }
  ];

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: choices
    }
  ]);

  switch (action) {
    case 'view':
      console.log(JSON.stringify(errorObject, null, 2));
      break;
    case 'update':
      await uej(errorObject);
      break;
    case 'apply':
      await ac();
      break;
    case 'save':
      sc(errorObject);
      console.log('Exiting...');
      process.exit();
      break;
    default:
      console.log('Invalid choice!');
      break;
  }

  await menu(errorObject);
};

const main = async () => {
  const errorObject = lcf();
  if (!errorObject) return;

  await menu(errorObject);
};

main();