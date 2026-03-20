import mongoose from 'mongoose';
import { MONGO_URI } from './env.js';

const connectDB = async () => {

  try {

    await mongoose.connect(MONGO_URI);

    console.log('Connected to MONGODB');


  } catch (error) {

    console.log(`Failed to connect MONGODB ${error.message}`);

    process.exit(1);
  }

};

export default connectDB;