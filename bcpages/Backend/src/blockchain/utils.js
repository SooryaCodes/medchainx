function generateUniqueId(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function hashData(data) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

function generateAccessToken() {
    const crypto = require('crypto');
    return crypto.randomBytes(16).toString('hex');
}

function isTokenValid(token, createdAt) {
    const currentTime = Date.now();
    return (currentTime - createdAt) < 5 * 60 * 1000; // 5 minutes
}
const { v4: uuidv4 } = require('uuid');

exports.generateUniqueId = (prefix) => {
    return `${prefix}-${uuidv4()}`;
};
module.exports = {
    generateUniqueId,
    hashData,
    generateAccessToken,
    isTokenValid
};