/*
READ BEFORE USAGE!!!
Do not modify this code. Changing a small piece could disable this tool if isn't fixed.
Here you cannot change anything, not even paths! 

Keep in mind `ladybug.log` should be always outside any assets, look at it more like a configuration file.

IF YOU DISAGREE WITH THIS USAGE YOU ARE BREAKING THE LICENSE OF THIS TOOL!!!!

Have A Satisfying Usage!

Ladybug v 0.1.1 
*/

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const logPath = path.resolve(__dirname, '../', 'ladybug.log');
const uri = process.env.MONGO_URI;

if (!fs.existsSync(path.dirname(logPath))) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
}

function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('Log file does not exist.');
    return null;
  }
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

async function connectDB() {
  if (!uri) {
    console.error('MongoDB URI is not set in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

const logSchema = new mongoose.Schema({
  log_file_hash: String,
  updated_at: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);

async function validateLogFile() {
  try {
    await connectDB();

    const record = await Log.findOne({});
    console.log('MongoDB record:', record);

    if (!record) {
      const originalHash = getFileHash(logPath);
      if (!originalHash) {
        console.error('Cannot compute hash. Log file is missing.');
        process.exit(1);
      }
      const newLog = await Log.create({ log_file_hash: originalHash });
      console.log('Hash saved in MongoDB:', newLog);
    } else {
      const storedHash = record.log_file_hash;
      const currentHash = getFileHash(logPath);

      if (!currentHash || currentHash !== storedHash) {
        console.error('The ladybug.log file has been tampered with, disabling the tool.');
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('Error during hash check or MongoDB connection:', err);
  } finally {
    await mongoose.disconnect();
  }
}

class Logger {
  constructor() {
    this.levels = ['info', 'warn', 'error'];
    this.level = 'info';
  }

  rotateLog() {
    const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5 MB
    if (fs.existsSync(logPath)) {
      const stats = fs.statSync(logPath);
      if (stats.size >= MAX_LOG_SIZE) {
        const archive = `${logPath}.${Date.now()}.backup`;
        fs.renameSync(logPath, archive);
        console.log(`Log rotated. Archive: ${archive}`);
      }
    }
  }

  writeLog(level, message) {
    this.rotateLog();

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}\n`;

    fs.appendFileSync(logPath, logMessage, 'utf8');
  }

  info(message) {
    if (this.levels.indexOf('info') >= this.levels.indexOf(this.level)) {
      this.writeLog('info', message);
    }
  }

  warn(message) {
    if (this.levels.indexOf('warn') >= this.levels.indexOf(this.level)) {
      this.writeLog('warn', message);
    }
  }

  error(message) {
    if (this.levels.indexOf('error') >= this.levels.indexOf(this.level)) {
      this.writeLog('error', message);
    }
  }

  setLevel(level) {
    if (this.levels.includes(level)) {
      this.level = level;
    } else {
      console.warn(`Invalid log level: ${level}. Defaulting to 'info'.`);
      this.level = 'info';
    }
  }
}

const logger = new Logger();

validateLogFile().catch((err) => console.error('Error:', err));

module.exports = logger;