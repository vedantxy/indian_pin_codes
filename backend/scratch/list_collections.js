require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function listCollections() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        
        for (let coll of collections) {
            const count = await mongoose.connection.db.collection(coll.name).countDocuments();
            console.log(`- ${coll.name}: ${count} documents`);
            if (count > 0) {
                const sample = await mongoose.connection.db.collection(coll.name).findOne({});
                console.log(`  Sample from ${coll.name}:`, JSON.stringify(sample, null, 2));
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listCollections();
