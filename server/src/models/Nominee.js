// Nominee Schema/Model
// Fields: nomineeId, userId, email, name, relationship, verificationStatus, createdAt

import mongoose from 'mongoose';

const nomineeSchema = new mongoose.Schema({
  // Schema definition
}, { timestamps: true });

export default mongoose.model('Nominee', nomineeSchema);
