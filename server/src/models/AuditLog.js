// AuditLog Schema/Model
// Fields: logId, userId, eventType, description, ipAddress, timestamp

import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  // Schema definition
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
