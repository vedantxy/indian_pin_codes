require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Pincode = require('../models/Pincode');

const sampleData = [
    { pincode: "384265", officeName: "Patan", district: "Patan", state: "Gujarat", deliveryStatus: "Delivery" },
    { pincode: "384285", officeName: "Sidhpur", district: "Patan", state: "Gujarat", deliveryStatus: "Delivery" },
    { pincode: "664587", officeName: "Test Office", district: "Test District", state: "Test State", deliveryStatus: "Non-Delivery" },
    { pincode: "110001", officeName: "New Delhi G.P.O.", district: "Central Delhi", state: "Delhi", deliveryStatus: "Delivery" },
    { pincode: "400001", officeName: "Mumbai G.P.O.", district: "Mumbai", state: "Maharashtra", deliveryStatus: "Delivery" }
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        await Pincode.deleteMany({}); // Purana khali data clear karein
        await Pincode.insertMany(sampleData);
        console.log('Sample data inserted successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedDB();
