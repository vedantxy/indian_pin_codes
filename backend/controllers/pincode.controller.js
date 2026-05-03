const Pincode = require('../models/Pincode.model');
const asyncHandler = require('../middleware/asyncHandler');

const STATE_KEY = 'stateName                                       ';

// ── GET /api/pincodes?state=&district=&taluk=&page=&limit= ─────────────────
exports.getFilteredPincodes = asyncHandler(async (req, res) => {
  const { state, district, taluk, page = 1, limit = 20 } = req.query;
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const query = {};
  if (state) query[STATE_KEY] = new RegExp(`^\\s*${state}\\s*$`, 'i');
  if (district) query.districtName = new RegExp(`^\\s*${district}\\s*$`, 'i');
  if (taluk) query.taluk = new RegExp(`^\\s*${taluk}\\s*$`, 'i');

  const [total, data] = await Promise.all([
    Pincode.countDocuments(query),
    Pincode.find(query)
      .skip((p - 1) * l)
      .limit(l)
      .lean(),
  ]);

  res.json({
    data: data.map((item) => ({
      officeName: (item.officeName || '').trim(),
      pincode: (item.pincode || '').trim(),
      district: (item.districtName || '').trim(),
      state: (item[STATE_KEY] || '').trim(),
      taluk: (item.taluk || '').trim(),
      deliveryStatus: (item.deliveryStatus || '').trim(),
    })),
    total,
    page: p,
    limit: l,
  });
});
