const Project = require('../models/Project');
const { getFieldMap } = require('../utils/fieldMap');
const { getQuery } = require('../utils/queryHelper');

exports.exportToCSV = async (req, res) => {
    try {
        const { state } = req.query;
        const query = state ? getQuery('stateName', state) : {};
        const fieldMap = getFieldMap();
        
        const data = await Project.find(query).lean();
        if (data.length === 0) {
            return res.status(404).send('No data found to export');
        }

        const fields = ['pincode', 'officeName', 'taluk', 'districtName', 'stateName', 'deliveryStatus'];
        const displayHeaders = ['Pincode', 'Office Name', 'Taluk', 'District', 'State', 'Delivery Status'];

        let csvContent = displayHeaders.join(',') + '\n';
        data.forEach(item => {
            const row = fields.map(field => {
                const actualKey = fieldMap[field] || field;
                let val = item[actualKey] || '';
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
