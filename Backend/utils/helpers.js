function generatePublicUserId(role) {
  const shortId = Date.now().toString().slice(-5);
  return role === 'teacher' ? `GV-${shortId}` : `SV-${shortId}`;
}

function generateClassCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function normalizeAnswer(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase().replace(/[.,!?;:]/g, '');
}

module.exports = {
  generatePublicUserId,
  generateClassCode,
  normalizeAnswer
};