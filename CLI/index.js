/*
READ BEFORE USAGE!!!
Do not modify any assets and funcionalities, you can ONLY modify paths.
- Paths That May Be Needed To Be Modified:
    * Ln 13 Col 51
    * Ln 19 Col 27
    * 

IF YOU DISAGREE WITH THIS USAGE YOU ARE BREAKING THE LICENSE OF THIS TOOL!!!!

Have A Satisfying Usage!

Ladybug v 0.1.1 
*/

const inquirer = require('inquirer');
const fs = require('fs');
const logger = require('../log/logger.js');
const readline = require('readline');
const yargs = require('yargs');
const LadybugConfig = require('./config.js');
const { menu } = require('./menu.js');
const { version } = require('./version.js');
const { help } = require('./help.js');
const { enable } = require('./enable.js');
const { disable } = require('./disable.js');

require('dotenv').config();

const ladybugConfig = new LadybugConfig();

yargs
  .scriptName("ladybug")
  .usage('$0 <command> [options]')
  .command('version', 'Show the version number', version)
  .command('help', 'Show help info', help)
  .command('enable', 'Enable ladybug functionality', enable)
  .command('disable', 'Disable ladybug functionality', disable)
  .command('docs', 'View DOCS here: https://github.com/giorgigelashvili12/Ladybug; Contains guides on how to use codes and functions with text and videos.', () => {
    console.log('Have a fun time learning!');
    process.exit(1);
  })
  .demandCommand(1, 'need to specify a command!')
  .help()
  .parse();

if (ladybugConfig.config.enabled) {
  async function runCLI() {
    try {
      logger.info('CLI started');
      await menu(ladybugConfig);
      logger.info('CLI execution completed');
    } catch (err) {
      logger.error(`Error occurred: ${err.message}`);
    }
  }

  runCLI();
} else {
  console.log('CLI is disabled in the configuration.');
}

module.exports = { LadybugConfig, menu };