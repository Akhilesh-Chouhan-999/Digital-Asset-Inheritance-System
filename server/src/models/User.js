// User Schema/Model
// Fields: userId, email, password (bcrypt), firstName, lastName, phoneNumber, address, dateOfBirth, createdAt, updatedAt

import mongoose from 'mongoose';
import { validateEmailSchema, validatePasswordSchema } from '../middleware/validationMiddleware.js';

const userSchema = new mongoose.Schema({
  // User Identity Fields
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validateEmailSchema,
      message: 'Invalid email format'
    }
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
    validate: {
      validator: validatePasswordSchema,
      message: 'Password must be at least 8 characters'
    },
    select: false
  },

  phoneNumber: {
    type: String,
    trim: true,
    match: [/^\d{10,15}$/, 'Please provide a valid phone number'],
    default: null
  },

  dateOfBirth: {
    type: Date,
    default: null
  },

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

  // Account Status Fields
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  lastActiveAt: {
    type: Date,
    default: Date.now
  },

  emailVerified: {
    type: Boolean,
    default: false
  },

  emailVerificationToken: {
    type: String,
    select: false,
    default: null
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

// Create indexes for commonly queried fields
// Note: email index is already created by unique: true constraint
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Set virtuals to be included when converting to JSON
userSchema.set('toJSON', { virtuals: true });

// Password hashing middleware should be implemented in AuthService
// Model does not include password hashing here to keep the model clean

export default mongoose.model('User', userSchema);
