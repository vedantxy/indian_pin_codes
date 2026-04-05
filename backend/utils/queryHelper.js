const { getFieldMap } = require('./fieldMap');

const getQuery = (field, value) => {
    const fieldMap = getFieldMap();
    const actualKey = fieldMap[field] || field;
    // Use regex to match value with optional leading/trailing whitespace
    return { [actualKey]: new RegExp(`^\\s*${value}\\s*$`, 'i') };
};

module.exports = { getQuery };
