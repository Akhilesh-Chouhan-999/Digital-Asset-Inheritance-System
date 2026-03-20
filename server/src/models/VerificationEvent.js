// VerificationEvent Schema/Model
// Fields: eventId, userId, type, token (hashed), expiresAt, isUsed, createdAt

import mongoose from 'mongoose';

const verificationEventSchema = new mongoose.Schema({
  // Schema definition
}, { timestamps: true });

export default mongoose.model('VerificationEvent', verificationEventSchema);
