/*
READ BEFORE USAGE!!!
Do not modify any assets and funcionalities, you can ONLY modify paths.
- Paths That May Be Needed To Be Modified:
    * Ln 19 Col 27
    * 

IF YOU DISAGREE WITH THIS USAGE YOU ARE BREAKING THE LICENSE OF THIS TOOL!!!!

Have A Satisfying Usage!

Ladybug v 0.1.1 
*/
const fs = require('fs');
const path = require('path');

class LadybugConfig {
  constructor(filename = './messages/v1/v1.json') {
    this.filename = filename;
    this.config = this.loadConfig();
  }

  loadConfig() {
    if (fs.existsSync(this.filename)) {
      const configData = fs.readFileSync(this.filename);
      return JSON.parse(configData);
    } else {
      console.log(`File ${this.filename} does not exist.`);
      return null;
    }
  }

  saveConfig() {
    fs.writeFileSync(this.filename, JSON.stringify(this.config, null, 2));
    console.log(`Config saved to ${this.filename}`);
  }
  
  updateErrorObject(errorType, updates) {
    const errorObj = this.config[errorType];
    if (!errorObj) return;

    if (updates.msg) errorObj.err.msg = updates.msg;
    if (updates.headers) errorObj.config.headers = JSON.parse(updates.headers);
    if (updates.data) errorObj.config.data = updates.data;
    if (updates.url) errorObj.config.url = updates.url;
    if (updates.method) errorObj.config.method = updates.method;
  }
}

module.exports = LadybugConfig;