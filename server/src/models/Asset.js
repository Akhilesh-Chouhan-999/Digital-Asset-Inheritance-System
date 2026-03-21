// Asset Schema/Model
// Fields: assetId, userId, type, encryptedData, metadata, createdAt, expiryDate

import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Asset Information
  type: {
    type: String,
    enum: ['social', 'subscription', 'confidential_note', 'crypto', 'other'],
    required: true,
    trim: true
  },

  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },

  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: null
  },

  // Encrypted Content
  encryptedData: {
    type: String,
    required: true,
    select: false
  },

  encryptionAlgorithm: {
    type: String,
    default: 'AES-256-GCM'
  },

  // Metadata and Additional Information
  metadata: {
    platform: {
      type: String,
      trim: true,
      default: null
    },
    accountUsername: {
      type: String,
      trim: true,
      default: null
    },
    category: {
      type: String,
      trim: true,
      default: null
    },
    tags: {
      type: [String],
      default: []
    },
    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },

  // Access Control
  visibility: {
    type: String,
    enum: ['private', 'nominee_only', 'on_death'],
    default: 'on_death'
  },

  accessibleTo: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Nominee',
    default: []
  },

  // Expiration and Status
  expiryDate: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },

  isShared: {
    type: Boolean,
    default: false
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

// Create indexes for efficient querying
assetSchema.index({ userId: 1, status: 1 });
assetSchema.index({ userId: 1, type: 1 });
assetSchema.index({ userId: 1, createdAt: -1 });
assetSchema.index({ expiryDate: 1 });
assetSchema.index({ 'metadata.tags': 1 });

export default mongoose.model('Asset', assetSchema);
