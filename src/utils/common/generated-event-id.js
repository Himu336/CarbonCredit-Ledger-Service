const crypto = require('crypto');

/**
 * Generate a deterministic but unique Event ID based on recordId, eventType, and timestamp
 * @param {Object} data - Object containing recordId and eventType
 * @param {string} data.recordId - The record ID this event belongs to
 * @param {string} data.type - Type of event (CREATED, UPDATED, TRANSFERRED, etc.)
 * @returns {string} - SHA256 hash as unique Event ID
 */
function generateEventId(data) {
    if (!data || !data.recordId || !data.type) {
        throw new Error('recordId and type are required to generate Event ID');
    }

    const timestamp = Date.now().toString();
    const salt = crypto.randomBytes(4).toString('hex'); // add some randomness
    const hash = crypto.createHash('sha256')
        .update(data.recordId + data.type + timestamp + salt)
        .digest('hex');

    return hash;
}

module.exports = generateEventId;
