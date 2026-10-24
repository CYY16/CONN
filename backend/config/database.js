const mongoose = require('mongoose');

const connectDatabase = async () => {
    if (!process.env.DB_URI) {
        throw new Error('DB_URI is not defined. Please set the MongoDB connection string.');
    }

    try {
        const connection = await mongoose.connect(process.env.DB_URI);
        console.log(`MongoDB Database connected with HOST: ${connection.connection.host}`);
        return connection;
    } catch (error) {
        console.error('MongoDB Database connection failed:', error.message);
        throw error;
    }
};

module.exports = connectDatabase;