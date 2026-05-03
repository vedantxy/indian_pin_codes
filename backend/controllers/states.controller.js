const Pincode = require('../models/Pincode.model');
const asyncHandler = require('../middleware/asyncHandler');

const STATE_KEY = 'stateName                                       ';

// ── GET /api/states ─────────────────────────────────────────────────────────
exports.getStates = asyncHandler(async (_req, res) => {
  const raw = await Pincode.distinct(STATE_KEY);
  const states = [...new Set(raw.map((s) => (s ? s.trim() : s)).filter(Boolean))];
  res.json(states.sort());
});

// ── GET /api/states/:state/districts ────────────────────────────────────────
exports.getDistricts = asyncHandler(async (req, res) => {
  const { state } = req.params;
  const query = { [STATE_KEY]: new RegExp(`^\\s*${state}\\s*$`, 'i') };
  const raw = await Pincode.distinct('districtName', query);
  const districts = [...new Set(raw.map((d) => (d ? d.trim() : d)).filter(Boolean))];
  res.json(districts.sort());
});

// ── GET /api/states/:state/districts/:district/taluks ───────────────────────
exports.getTaluks = asyncHandler(async (req, res) => {
  const { state, district } = req.params;
  const query = {
    [STATE_KEY]: new RegExp(`^\\s*${state}\\s*$`, 'i'),
    districtName: new RegExp(`^\\s*${district}\\s*$`, 'i'),
  };
  const raw = await Pincode.distinct('taluk', query);
  const taluks = [...new Set(raw.map((t) => (t ? t.trim() : t)).filter(Boolean))];
  res.json(taluks.sort());
});

// ── GET /api/states/:state  (State Directory – grouped by district) ────────
exports.getStateDirectory = asyncHandler(async (req, res) => {
  const { state } = req.params;
  const query = { [STATE_KEY]: new RegExp(`^\\s*${state}\\s*$`, 'i') };
  const data = await Pincode.find(query).lean();

  const grouped = {};
  for (const item of data) {
    const district = (item.districtName || 'Unknown').trim();
    const office = (item.officeName || '').trim();
    if (!grouped[district]) grouped[district] = [];
    if (office && !grouped[district].includes(office)) {
      grouped[district].push(office);
    }
  }

  res.json(grouped);
});
