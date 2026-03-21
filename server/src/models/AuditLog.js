// AuditLog Schema/Model
// Fields: logId, userId, eventType, description, ipAddress, timestamp

import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Event Information
  eventType: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  severity: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info'
  },

  description: {
    type: String,
    required: true,
    maxlength: 500
  },

  // Additional Event Context
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Request Information
  ipAddress: {
    type: String,
    required: true,
    trim: true,
    match: [/^(?:\d{1,3}\.){3}\d{1,3}$|^([a-f0-9:]+)$/, 'Please provide a valid IPv4 or IPv6 address']
  },

  userAgent: {
    type: String,
    trim: true,
    maxlength: 500,
    default: null
  },

  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

// Create indexes for efficient querying
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ eventType: 1 });
auditLogSchema.index({ severity: 1 });
auditLogSchema.index({ timestamp: -1 });

export default mongoose.model('AuditLog', auditLogSchema);

