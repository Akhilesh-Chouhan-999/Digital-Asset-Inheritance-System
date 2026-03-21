// InactivityCase Schema/Model (Dead Man's Switch)
// Fields: caseId, userId, state, startedAt, thresholdDays, reminderSentAt, lastCheckedAt, resolvedAt

import mongoose from 'mongoose';


const inactivityCaseSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Case Status Information
  state: {
    type: String,
    enum: ['monitoring', 'warning_sent', 'reminder_sent', 'triggered', 'resolved'],
    default: 'monitoring'
  },

  // Inactivity Tracking
  inactiveDays: {
    type: Number,
    default: 0
  },

  thresholdDays: {
    type: Number,
    required: true,
    default: 90
  },

  // Timeline Events
  firstWarningAt: {
    type: Date,
    default: null
  },

  lastReminderAt: {
    type: Date,
    default: null
  },

  nextActionAt: {
    type: Date,
    default: null
  },

  lastCheckedAt: {
    type: Date,
    default: null
  },

  // Response Verification
  responseTokenHash: {
    type: String,
    select: false,
    default: null
  },

  responseDeadlineAt: {
    type: Date,
    default: null
  },

  // Case Resolution
  triggeredAt: {
    type: Date,
    default: null
  },

  resolvedAt: {
    type: Date,
    default: null
  },

  resolutionReason: {
    type: String,
    trim: true,
    default: null
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
inactivityCaseSchema.index({ userId: 1, nextActionAt: 1 });
inactivityCaseSchema.index({ state: 1 });
inactivityCaseSchema.index({ nextActionAt: 1 });
inactivityCaseSchema.index({ triggeredAt: 1 });

export default mongoose.model('InactivityCase', inactivityCaseSchema);
