require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function scanCluster() {
    try {
        const client = await mongoose.connect(process.env.MONGO_URI);
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        
        for (let dbInfo of dbs.databases) {
            if (['admin', 'local', 'config', 'sample_mflix'].includes(dbInfo.name)) continue;
            
            console.log(`Scanning DB: ${dbInfo.name}`);
            const db = mongoose.connection.useDb(dbInfo.name);
            const collections = await db.db.listCollections().toArray();
            
            for (let coll of collections) {
                const count = await db.db.collection(coll.name).countDocuments();
                console.log(`  - ${coll.name}: ${count} documents`);
                if (count > 0) {
                    const sample = await db.db.collection(coll.name).findOne({});
                    console.log(`    Sample:`, JSON.stringify(sample).substring(0, 200));
                }
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

scanCluster();
