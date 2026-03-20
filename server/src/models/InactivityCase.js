// InactivityCase Schema/Model (Dead Man's Switch)
// Fields: caseId, userId, state, startedAt, thresholdDays, reminderSentAt, lastCheckedAt, resolvedAt

import mongoose from 'mongoose';

const inactivityCaseSchema = new mongoose.Schema({
  // Schema definition
}, { timestamps: true });

export default mongoose.model('InactivityCase', inactivityCaseSchema);
