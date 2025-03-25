'use strict';

const parseError = (err) => {
  const rawMessage = typeof err === 'string' ? err : err.message || '';
  const [codePart, messagePart] = rawMessage.split('|');

  const code = /^\d+$/.test(codePart) ? parseInt(codePart, 10) : 500;
  const message = messagePart ? messagePart.trim() : rawMessage.trim();

  return { code, message };
}

module.exports = parseError;
