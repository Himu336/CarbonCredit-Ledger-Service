const crypto = require('crypto');

/**
 * Generates a deterministic SHA-256 hash as recordId
 * @param {Object} data - The record data
 * @param {string} data.projectName
 * @param {string} data.registry
 * @param {number} data.vintage
 * @param {number} data.quantity
 * @param {string} [data.serialNumber]
 * @returns {string} recordId
 */
function generateRecordId({ projectName, registry, vintage, quantity, serialNumber }) {
  return crypto
    .createHash('sha256')
    .update(projectName + registry + vintage + quantity + (serialNumber || ''))
    .digest('hex');
}

module.exports = generateRecordId;
