require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

async function inspect() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hackthone');
    const collection = mongoose.connection.collection('project');
    const doc = await collection.findOne();
    let output = '--- Document Data ---\n';
    for (const [key, value] of Object.entries(doc)) {
        output += `KEY: [${key}] | VALUE: [${value}]\n`;
    }
    fs.writeFileSync('inspect_results.txt', output);
    console.log('Results written to inspect_results.txt');
    process.exit();
}

inspect();
