import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const connectDB = async()=> {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGODB_URI is not defined in the environment variables');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');

};

const disconnectDB = async() => {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
};

export { connectDB, disconnectDB };