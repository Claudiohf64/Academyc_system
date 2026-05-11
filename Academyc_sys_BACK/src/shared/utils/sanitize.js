function stripHtmlTags(value) {
  return typeof value === 'string' ? value.replace(/<[^>]*>/g, '') : value;
}
function normalizeWhitespace(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value;
}
module.exports = { stripHtmlTags, normalizeWhitespace };