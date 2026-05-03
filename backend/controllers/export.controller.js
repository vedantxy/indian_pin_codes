const Pincode = require('../models/Pincode.model');
const { buildCSV } = require('../utils/csvBuilder');
const asyncHandler = require('../middleware/asyncHandler');

const STATE_KEY = 'stateName                                       ';

// ── GET /api/export?state=&district=&taluk= ─────────────────────────────────
exports.exportToCSV = asyncHandler(async (req, res) => {
  const { state, district, taluk } = req.query;

  const query = {};
  if (state) query[STATE_KEY] = new RegExp(`^\\s*${state}\\s*$`, 'i');
  if (district) query.districtName = new RegExp(`^\\s*${district}\\s*$`, 'i');
  if (taluk) query.taluk = new RegExp(`^\\s*${taluk}\\s*$`, 'i');

  const data = await Pincode.find(query).lean();
  if (data.length === 0) {
    return res.status(404).send('No data found to export');
  }

  const fields = ['pincode', 'officeName', 'taluk', 'districtName', STATE_KEY, 'deliveryStatus'];
  const headers = ['Pincode', 'Office Name', 'Taluk', 'District', 'State', 'Delivery Status'];

  const csvContent = buildCSV(data, fields, headers);
  const fileName = state
    ? `pincode_data_${state.toLowerCase().replace(/ /g, '_')}.csv`
    : 'pincode_data_all.csv';

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  res.send(csvContent);
});
