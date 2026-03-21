// Crypto Utilities
// Functions: encryptData() - AES-256-GCM, decryptData(), hashPassword() - bcrypt, verifyPassword(), generateToken()

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from './env.js';

export const encryptData = (data, key) => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return {
      iv: iv.toString('hex'),
      encrypted,
      authTag: authTag.toString('hex')
    };
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message);
  }
};

export const decryptData = (ciphertext, key, iv, authTag) => {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(ciphertext, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message);
  }
};

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
    
  } catch (error) {
    throw new Error('Password hashing failed: ' + error.message);
  }
};

export const verifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Password verification failed: ' + error.message);
  }
};

export const generateToken = (payload, expiresIn = '7d') => {
  try {
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn });
  } catch (error) {
    throw new Error('Token generation failed: ' + error.message);
  }
};

export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    throw new Error('Token verification failed: ' + error.message);
  }
};
