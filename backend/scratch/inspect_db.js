require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const doc = await mongoose.connection.db.collection('pincodes').findOne({});
        console.log('Sample Document:', JSON.stringify(doc, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
