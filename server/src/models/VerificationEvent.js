// VerificationEvent Schema/Model
// Fields: eventId, userId, type, token (hashed), expiresAt, isUsed, createdAt

import mongoose from 'mongoose';

const verificationEventSchema = new mongoose.Schema({
  // Reference Fields
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  nomineeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nominee',
    default: null
  },

  inactivityCaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InactivityCase',
    required: true
  },

  // Event Type and Channel
  type: {
    type: String,
    enum: ['email_verification', 'sms_verification', 'inactivity_response', 'nominee_notification'],
    required: true
  },

  channel: {
    type: String,
    enum: ['email', 'sms', 'app_notification', 'push'],
    required: true
  },

  // Verification Token
  tokenHash: {
    type: String,
    select: false,
    default: null
  },

  expiresAt: {
    type: Date,
    default: null
  },

  // Status Tracking
  status: {
    type: String,
    enum: ['sent', 'delivered', 'failed', 'clicked', 'responded'],
    default: 'sent'
  },

  isUsed: {
    type: Boolean,
    default: false
  },

  usedAt: {
    type: Date,
    default: null
  },

  // Provider Information
  providerMessageId: {
    type: String,
    trim: true,
    default: null
  },

  providerName: {
    type: String,
    enum: ['sendgrid', 'twilio', 'firebase', 'custom'],
    default: null
  },

  // Event Details
  recipient: {
    type: String,
    trim: true,
    required: true
  },

  attemptCount: {
    type: Number,
    default: 0
  },

  lastAttemptAt: {
    type: Date,
    default: null
  },

  failureReason: {
    type: String,
    trim: true,
    default: null
  },

  metadata: {
    userAgent: {
      type: String,
      default: null
    },
    ipAddress: {
      type: String,
      default: null
    },
    customData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
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
verificationEventSchema.index({ userId: 1, createdAt: -1 });
verificationEventSchema.index({ inactivityCaseId: 1, status: 1 });
verificationEventSchema.index({ type: 1, status: 1 });
verificationEventSchema.index({ expiresAt: 1 });
verificationEventSchema.index({ recipient: 1 });

export default mongoose.model('VerificationEvent', verificationEventSchema);

