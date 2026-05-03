require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function listDatabases() {
    try {
        const client = await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('Databases:', JSON.stringify(dbs, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listDatabases();
