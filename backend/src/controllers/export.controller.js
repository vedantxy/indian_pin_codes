const Pincode = require('../models/Pincode.model');

const STATE_KEY = 'stateName                                       ';

exports.exportToCSV = async (req, res) => {
    try {
        const { state } = req.query;
        const query = state ? { [STATE_KEY]: new RegExp(`^\\s*${state}\\s*$`, 'i') } : {};
        
        const data = await Pincode.find(query).lean();
        if (data.length === 0) {
            return res.status(404).send('No data found to export');
        }

        const fields = ['pincode', 'officeName', 'taluk', 'districtName', STATE_KEY, 'deliveryStatus'];
        const displayHeaders = ['Pincode', 'Office Name', 'Taluk', 'District', 'State', 'Delivery Status'];

        let csvContent = displayHeaders.join(',') + '\n';
        data.forEach(item => {
            const row = fields.map(field => {
                let val = item[field] || '';
                if (typeof val === 'string') val = val.trim();
                const escaped = val.toString().replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvContent += row.join(',') + '\n';
        });

        const fileName = state ? `pincode_data_${state.toLowerCase().replace(/ /g, '_')}.csv` : 'pincode_data_all.csv';
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.status(200).send(csvContent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
