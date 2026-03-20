// Asset Schema/Model
// Fields: assetId, userId, type, encryptedData, metadata, createdAt, expiryDate

import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  // Schema definition
}, { timestamps: true });

export default mongoose.model('Asset', assetSchema);
