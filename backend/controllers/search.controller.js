const Pincode = require('../models/Pincode.model');
const SearchLog = require('../models/SearchLog.model');
const asyncHandler = require('../middleware/asyncHandler');

const STATE_KEY = 'stateName                                       ';

// ── GET /api/search?q=... ───────────────────────────────────────────────────
exports.searchPincodes = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);

  const regex = new RegExp(q, 'i');
  const query = {
    $or: [
      { officeName: regex },
      { pincode: regex },
      { districtName: regex },
      { [STATE_KEY]: regex },
    ],
  };

  // Fire-and-forget log — don't block the response
  new SearchLog({ query: q, type: 'Search' }).save().catch(() => {});

  const results = await Pincode.find(query).limit(15).lean();
  res.json(
    results.map((item) => ({
      officeName: (item.officeName || '').trim(),
      pincode: (item.pincode || '').trim(),
      district: (item.districtName || '').trim(),
      state: (item[STATE_KEY] || '').trim(),
      taluk: (item.taluk || '').trim(),
      deliveryStatus: (item.deliveryStatus || '').trim(),
    }))
  );
});

// ── GET /api/search/:pincode ────────────────────────────────────────────────
exports.getPincodeDetails = asyncHandler(async (req, res) => {
  const { pincode } = req.params;
  const results = await Pincode.find({ pincode }).lean();

  if (results.length === 0) {
    return res.status(404).json({ message: 'No offices found for this pincode' });
  }

  new SearchLog({ query: pincode, type: 'Pincode' }).save().catch(() => {});

  res.json(
    results.map((item) => ({
      officeName: (item.officeName || '').trim(),
      pincode: (item.pincode || '').trim(),
      district: (item.districtName || '').trim(),
      state: (item[STATE_KEY] || '').trim(),
      taluk: (item.taluk || '').trim(),
      deliveryStatus: (item.deliveryStatus || '').trim(),
    }))
  );
});
