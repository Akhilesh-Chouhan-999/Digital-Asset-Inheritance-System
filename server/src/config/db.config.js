import mongoose from 'mongoose';
import { MONGO_URI } from '../utils/env.js';
import logger from '../utils/logger.js';
import { OkResponse } from '../utils/successResponse.js';

const connectDB = async () => {
 
  try {

    const conn = await mongoose.connect(MONGO_URI);

    logger.info('Connected to MongoDB successfully');

    return new OkResponse(conn , 'Connected to mongodb successfully') ; 


  } catch (error) {

    logger.error(`Failed to connect to MongoDB: ${error.message}`, error);
    
    process.exit(1);

  }
};

export default connectDB;