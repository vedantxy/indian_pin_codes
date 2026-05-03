const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection) return cachedConnection;

    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hackthone';
    try {
        cachedConnection = await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        return cachedConnection;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        // Do not exit process in serverless; let the invocation fail
        throw err;
    }
};

module.exports = connectDB;
