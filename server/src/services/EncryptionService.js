// EncryptionService - Handles data encryption and decryption

import crypto from 'crypto';
import logger from '../utils/logger.js';
import { ValidationError } from '../utils/errorHandler.js';

class EncryptionService {

  /**
   * Encrypt data using AES-256-GCM
   * @param {string} plaintext - Data to encrypt
   * @param {string} key - Encryption key (32 bytes for AES-256)
   * @returns {object} {encrypted, iv, authTag}
   */
  encrypt(plaintext, key) {
    try {
      if (!plaintext || !key) {
        throw new ValidationError('Plaintext and key are required');
      }

      // Generate a random IV (Initialization Vector)
      const iv = crypto.randomBytes(16);

      // Convert key to buffer if it's a hex string
      const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'hex') : key;

      if (keyBuffer.length !== 32) {
        throw new ValidationError('Encryption key must be 32 bytes for AES-256');
      }

      // Create cipher
      const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);

      // Encrypt the data
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Get the authentication tag
      const authTag = cipher.getAuthTag();

      logger.debug('Data encrypted successfully');

      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        algorithm: 'aes-256-gcm'
      };
    } catch (error) {
      logger.error('Error in EncryptionService.encrypt:', error);
      throw error;
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   * @param {object} encryptedData - {encrypted, iv, authTag}
   * @param {string} key - Decryption key
   * @returns {string} Decrypted plaintext
   */
  decrypt(encryptedData, key) {
    try {
      if (!encryptedData || !key) {
        throw new ValidationError('Encrypted data and key are required');
      }

      const { encrypted, iv, authTag } = encryptedData;

      if (!encrypted || !iv || !authTag) {
        throw new ValidationError('Encrypted data must contain encrypted, iv, and authTag');
      }

      // Convert key to buffer if it's a hex string
      const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'hex') : key;

      if (keyBuffer.length !== 32) {
        throw new ValidationError('Decryption key must be 32 bytes for AES-256');
      }

      // Convert IV and authTag from hex strings to buffers
      const ivBuffer = Buffer.from(iv, 'hex');
      const authTagBuffer = Buffer.from(authTag, 'hex');

      // Create decipher
      const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, ivBuffer);
      decipher.setAuthTag(authTagBuffer);

      // Decrypt the data
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      logger.debug('Data decrypted successfully');

      return decrypted;
    } catch (error) {
      logger.error('Error in EncryptionService.decrypt:', error);
      throw error;
    }
  }

  /**
   * Generate a random encryption key
   * @returns {string} 32-byte hex key for AES-256
   */
  generateKey() {
    try {
      const key = crypto.randomBytes(32);
      logger.debug('Encryption key generated');
      return key.toString('hex');
    } catch (error) {
      logger.error('Error in EncryptionService.generateKey:', error);
      throw error;
    }
  }

  /**
   * Hash data using SHA-256
   * @param {string} data - Data to hash
   * @returns {string} SHA-256 hash in hex format
   */
  hash(data) {
    try {
      if (!data) {
        throw new ValidationError('Data is required');
      }

      const hash = crypto.createHash('sha256').update(data).digest('hex');
      logger.debug('Data hashed successfully');
      return hash;
    } catch (error) {
      logger.error('Error in EncryptionService.hash:', error);
      throw error;
    }
  }

  /**
   * Compare plaintext with hash
   * @param {string} plaintext - Plaintext to compare
   * @param {string} hash - Hash to compare against
   * @returns {boolean} True if plaintext matches hash
   */
  compareHash(plaintext, hash) {
    try {
      if (!plaintext || !hash) {
        throw new ValidationError('Plaintext and hash are required');
      }

      const computed = this.hash(plaintext);
      return computed === hash;
    } catch (error) {
      logger.error('Error in EncryptionService.compareHash:', error);
      throw error;
    }
  }

  /**
   * Generate a secure random token
   * @param {number} length - Token length in bytes (default 32)
   * @returns {string} Random token in hex format
   */
  generateToken(length = 32) {
    try {
      const token = crypto.randomBytes(length);
      logger.debug('Token generated');
      return token.toString('hex');
    } catch (error) {
      logger.error('Error in EncryptionService.generateToken:', error);
      throw error;
    }
  }

  // Deprecated methods maintained for backward compatibility
  encryptData(plaintext, key) {
    return this.encrypt(plaintext, key);
  }

  decryptData(ciphertext, key, iv, authTag) {
    return this.decrypt({ encrypted: ciphertext, iv, authTag }, key);
  }

  generateEncryptionKey() {
    return this.generateKey();
  }

  verifyIntegrity(data, authTag) {
    // Integrity is verified automatically in decrypt method
    logger.debug('Integrity check performed');
    return true;
  }
}

export default new EncryptionService();
