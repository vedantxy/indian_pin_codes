/**
 * Build CSV content from an array of MongoDB documents.
 *
 * @param {Array} data     – Array of lean Mongoose documents
 * @param {Array} fields   – Keys to extract from each document
 * @param {Array} headers  – Display column headers (same order as fields)
 * @returns {String}       – RFC-4180 compliant CSV string
 */
const buildCSV = (data, fields, headers) => {
  const rows = [headers.join(',')];

  for (const item of data) {
    const cells = fields.map((field) => {
      let val = item[field] ?? '';
      if (typeof val === 'string') val = val.trim();
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    rows.push(cells.join(','));
  }

  return rows.join('\n') + '\n';
};

module.exports = { buildCSV };
