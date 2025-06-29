import { EncryptionSettings } from '@/types';

export class EncryptionService {
  private static instance: EncryptionService;
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Generate a new encryption key using Web Crypto API
   */
  async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Export key to base64 string for storage
   */
  async exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  /**
   * Import key from base64 string
   */
  async importKey(keyString: string): Promise<CryptoKey> {
    const keyBuffer = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data using AES-GCM
   */
  async encrypt(data: string, key: CryptoKey): Promise<{ encrypted: string; iv: string }> {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
    const encodedData = this.encoder.encode(data);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encodedData
    );

    return {
      encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      iv: btoa(String.fromCharCode(...iv))
    };
  }

  /**
   * Decrypt data using AES-GCM
   */
  async decrypt(encryptedData: string, iv: string, key: CryptoKey): Promise<string> {
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const ivBuffer = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer
      },
      key,
      encryptedBuffer
    );

    return this.decoder.decode(decrypted);
  }

  /**
   * Generate a secure hash of data using SHA-256
   */
  async hash(data: string): Promise<string> {
    const encodedData = this.encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  }

  /**
   * Generate a secure random string for tokens/IDs
   */
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/[+/=]/g, '')
      .substring(0, length);
  }

  /**
   * Get or create user encryption settings
   */
  async getUserEncryptionSettings(userId: string): Promise<EncryptionSettings> {
    const saved = localStorage.getItem(`encryption_settings_${userId}`);
    
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastKeyRotation: new Date(parsed.lastKeyRotation),
        nextKeyRotation: new Date(parsed.nextKeyRotation)
      };
    }

    // Create default settings
    const now = new Date();
    const nextRotation = new Date();
    nextRotation.setMonth(nextRotation.getMonth() + 3); // Rotate every 3 months

    const settings: EncryptionSettings = {
      userId,
      encryptionEnabled: true,
      keyVersion: 1,
      algorithm: 'AES-256-GCM',
      encryptedFields: ['healthData', 'sessions', 'messages', 'personalNotes'],
      lastKeyRotation: now,
      nextKeyRotation: nextRotation
    };

    localStorage.setItem(`encryption_settings_${userId}`, JSON.stringify(settings));
    return settings;
  }

  /**
   * Update user encryption settings
   */
  async updateEncryptionSettings(userId: string, settings: Partial<EncryptionSettings>): Promise<EncryptionSettings> {
    const current = await this.getUserEncryptionSettings(userId);
    const updated = { ...current, ...settings };
    
    localStorage.setItem(`encryption_settings_${userId}`, JSON.stringify(updated));
    return updated;
  }

  /**
   * Get or create user encryption key
   */
  async getUserEncryptionKey(userId: string): Promise<CryptoKey> {
    const keyString = localStorage.getItem(`encryption_key_${userId}`);
    
    if (keyString) {
      return await this.importKey(keyString);
    }

    // Generate new key
    const key = await this.generateKey();
    const exportedKey = await this.exportKey(key);
    localStorage.setItem(`encryption_key_${userId}`, exportedKey);
    
    return key;
  }

  /**
   * Rotate user encryption key
   */
  async rotateUserKey(userId: string): Promise<{ oldKey: CryptoKey; newKey: CryptoKey }> {
    const oldKey = await this.getUserEncryptionKey(userId);
    const newKey = await this.generateKey();
    const exportedNewKey = await this.exportKey(newKey);
    
    // Store new key
    localStorage.setItem(`encryption_key_${userId}`, exportedNewKey);
    
    // Update settings
    const settings = await this.getUserEncryptionSettings(userId);
    await this.updateEncryptionSettings(userId, {
      keyVersion: settings.keyVersion + 1,
      lastKeyRotation: new Date(),
      nextKeyRotation: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000) // 3 months
    });

    return { oldKey, newKey };
  }

  /**
   * Encrypt sensitive user data
   */
  async encryptUserData(userId: string, data: Record<string, any>): Promise<Record<string, any>> {
    const key = await this.getUserEncryptionKey(userId);
    const settings = await this.getUserEncryptionSettings(userId);
    
    if (!settings.encryptionEnabled) {
      return data;
    }

    const encrypted: Record<string, any> = { ...data };
    
    for (const field of settings.encryptedFields) {
      if (data[field] !== undefined) {
        const fieldData = typeof data[field] === 'string' ? data[field] : JSON.stringify(data[field]);
        const result = await this.encrypt(fieldData, key);
        encrypted[field] = {
          _encrypted: true,
          data: result.encrypted,
          iv: result.iv,
          keyVersion: settings.keyVersion
        };
      }
    }

    return encrypted;
  }

  /**
   * Decrypt sensitive user data
   */
  async decryptUserData(userId: string, data: Record<string, any>): Promise<Record<string, any>> {
    const key = await this.getUserEncryptionKey(userId);
    const settings = await this.getUserEncryptionSettings(userId);
    
    const decrypted: Record<string, any> = { ...data };
    
    for (const field of settings.encryptedFields) {
      if (data[field] && data[field]._encrypted) {
        try {
          const decryptedData = await this.decrypt(
            data[field].data,
            data[field].iv,
            key
          );
          
          // Try to parse as JSON, fallback to string
          try {
            decrypted[field] = JSON.parse(decryptedData);
          } catch {
            decrypted[field] = decryptedData;
          }
        } catch (error) {
          console.error(`Failed to decrypt field ${field}:`, error);
          // Leave encrypted data in place if decryption fails
        }
      }
    }

    return decrypted;
  }

  /**
   * Check if key rotation is needed
   */
  async isKeyRotationNeeded(userId: string): Promise<boolean> {
    const settings = await this.getUserEncryptionSettings(userId);
    return new Date() >= settings.nextKeyRotation;
  }

  /**
   * Validate data integrity using hash
   */
  async validateDataIntegrity(data: string, expectedHash: string): Promise<boolean> {
    const actualHash = await this.hash(data);
    return actualHash === expectedHash;
  }

  /**
   * Create data fingerprint for audit purposes
   */
  async createDataFingerprint(data: Record<string, any>): Promise<string> {
    const sortedData = JSON.stringify(data, Object.keys(data).sort());
    return await this.hash(sortedData);
  }
}

export const encryptionService = EncryptionService.getInstance();