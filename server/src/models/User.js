// User Schema/Model
// Fields: userId, email, password (bcrypt), firstName, lastName, phoneNumber, address, dateOfBirth, createdAt, updatedAt

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Schema definition
}, { timestamps: true });

export default mongoose.model('User', userSchema);
