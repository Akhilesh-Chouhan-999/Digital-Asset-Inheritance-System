// Nominee Schema/Model
// Fields: nomineeId, userId, email, name, relationship, verificationStatus, createdAt

import mongoose from 'mongoose';
import { validateEmail } from '../middleware/validationMiddleware.js';


const nomineeSchema = new mongoose.Schema({
  // Nominee Identity Fields
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validateEmail,
      message: 'Invalid email format'
    }
  },

  phoneNumber: {
    type: String,
    trim: true,
    match: [/^\d{10,15}$/, 'Please provide a valid phone number'],
    default: null
  },

  relationship: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },

  // Verification Fields
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },

  verificationToken: {
    type: String,
    select: false,
    default: null
  },

  verificationDate: {
    type: Date,
    default: null
  },

  // Address Information
  address: {
    street: {
      type: String,
      trim: true,
      default: null
    },
    city: {
      type: String,
      trim: true,
      default: null
    },
    state: {
      type: String,
      trim: true,
      default: null
    },
    postalCode: {
      type: String,
      trim: true,
      default: null
    },
    country: {
      type: String,
      trim: true,
      default: null
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

// Create compound unique index on userId and email to allow same email across different users
nomineeSchema.index({ userId: 1, email: 1 }, { unique: true });
nomineeSchema.index({ verificationStatus: 1 });
nomineeSchema.index({ createdAt: -1 });

// Virtual for nominee full name (alias)
nomineeSchema.virtual('displayName').get(function () {
  return this.name;
});

// Set virtuals to be included when converting to JSON
nomineeSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Nominee', nomineeSchema);
