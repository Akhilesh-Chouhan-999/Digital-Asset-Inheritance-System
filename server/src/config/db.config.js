import mongoose from 'mongoose';
import { MONGO_URI } from '../utils/env.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error(`Failed to connect to MongoDB: ${error.message}`, error);
    process.exit(1);
  }
};

export default connectDB;