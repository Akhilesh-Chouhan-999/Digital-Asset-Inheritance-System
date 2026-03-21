// Logger Utility
// Functions: info(), error(), warn(), debug()

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '..', 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const formatLog = (level, message, data = null) => {
  return JSON.stringify({
    timestamp: getTimestamp(),
    level,
    message,
    data
  });
};

export const info = (message, data = null) => {
  const log = formatLog('INFO', message, data);
  console.log(log);
  fs.appendFileSync(path.join(logsDir, 'info.log'), log + '\n');
};

export const error = (message, errorObj = null) => {
  const log = formatLog('ERROR', message, errorObj?.message);
  console.error(log);
  fs.appendFileSync(path.join(logsDir, 'error.log'), log + '\n');
};

export const warn = (message, data = null) => {
  const log = formatLog('WARN', message, data);
  console.warn(log);
  fs.appendFileSync(path.join(logsDir, 'warn.log'), log + '\n');
};

export const debug = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    const log = formatLog('DEBUG', message, data);
    console.log(log);
  }
};

export default { info, error, warn, debug };