const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema(
  {
    pincode: { type: String, required: true, index: true },
    officeName: { type: String, required: true },
    taluk: { type: String },
    districtName: { type: String, required: true },
    stateName: {
      type: String,
      alias: 'stateName                                       ',
    },
    deliveryStatus: { type: String, default: 'Non-Delivery' },
  },
  { collection: 'project', strict: false }
);

// ── Performance indexes for 1.54 lakh records ──────────────────────────────
pincodeSchema.index({ officeName: 'text', districtName: 'text' });
pincodeSchema.index({ deliveryStatus: 1 });
pincodeSchema.index(
  { 'stateName                                       ': 1, districtName: 1 },
  { name: 'state_district_compound' }
);

module.exports = mongoose.model('Pincode', pincodeSchema);
