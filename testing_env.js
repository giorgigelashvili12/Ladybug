/*
This is just a 'Testing Site'. Sample express app that contains main parts of our module.
Modifying this code is okay and doesn't disagree with our license and usage.

Have a fun time learning!

Ladybug v 1.5.0
*/

const express = require('express');
const inquirer = require('inquirer');
const fs = require('fs');
const logger = require('./logger.js');
const readline = require('readline');
const { LadybugConfig, LadybugServer, menu } = require('./cli.js');

const app = express();
const port = 3000;

app.use(express.static('public'));

const ladybugConfig = new LadybugConfig();

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Express App!</h1>>');
});

app.get('/admin', (req, res) => {
  runCLI()
    .then(() => res.send('CLI executed successfully! Check the console for logs.'))
    .catch((err) => res.send(`Error occurred in CLI: ${err.message}`));
});

app.listen(port, () => {
  console.log(`Express app is listening at http://localhost:${port}`);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// optional (Not Required)
function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function runCLI() {
  try {
    logger.info('CLI started');

    // optional (Not Required)
    const data = await promptUser('Type in something :D');
    console.log(data);
    
    logger.info('CLI execution completed');
    rl.close();
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`);
    rl.close();
  }
}

app.get('/menu', async (req, res) => {
  try {
    await menu(ladybugConfig);
    res.send('Menu executed successfully. Check the console for output.');
  } catch (err) {
    res.send(`Error occurred while running the menu: ${err.message}`);
  }
});