import { useState, useEffect } from 'react';
import { EncryptionSettings } from '@/types';
import { encryptionService } from '@/services/encryptionService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useEncryption = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<EncryptionSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyRotating, setKeyRotating] = useState(false);

  useEffect(() => {
    if (user) {
      loadEncryptionSettings();
      checkKeyRotationNeeded();
    }
  }, [user]);

  const loadEncryptionSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const encryptionSettings = await encryptionService.getUserEncryptionSettings(user.id);
      setSettings(encryptionSettings);
    } catch (error) {
      console.error('Failed to load encryption settings:', error);
      toast.error('Failed to load encryption settings');
    } finally {
      setLoading(false);
    }
  };

  const checkKeyRotationNeeded = async () => {
    if (!user) return;
    
    try {
      const rotationNeeded = await encryptionService.isKeyRotationNeeded(user.id);
      if (rotationNeeded) {
        toast.info('Your encryption key needs to be rotated for security. This will happen automatically.');
        await rotateEncryptionKey();
      }
    } catch (error) {
      console.error('Failed to check key rotation:', error);
    }
  };

  const updateEncryptionSettings = async (updates: Partial<EncryptionSettings>): Promise<boolean> => {
    if (!user || !settings) return false;
    
    setLoading(true);
    try {
      const updatedSettings = await encryptionService.updateEncryptionSettings(user.id, updates);
      setSettings(updatedSettings);
      
      toast.success('Encryption settings updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update encryption settings:', error);
      toast.error('Failed to update encryption settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleEncryption = async (): Promise<boolean> => {
    if (!settings) return false;
    
    return await updateEncryptionSettings({
      encryptionEnabled: !settings.encryptionEnabled
    });
  };

  const rotateEncryptionKey = async (): Promise<boolean> => {
    if (!user) return false;
    
    setKeyRotating(true);
    try {
      const { oldKey, newKey } = await encryptionService.rotateUserKey(user.id);
      
      // In a real application, you would need to re-encrypt existing data with the new key
      // For this demo, we'll just update the settings
      await loadEncryptionSettings();
      
      toast.success('Encryption key rotated successfully');
      return true;
    } catch (error) {
      console.error('Failed to rotate encryption key:', error);
      toast.error('Failed to rotate encryption key');
      return false;
    } finally {
      setKeyRotating(false);
    }
  };

  const encryptData = async (data: Record<string, any>): Promise<Record<string, any> | null> => {
    if (!user) return null;
    
    try {
      return await encryptionService.encryptUserData(user.id, data);
    } catch (error) {
      console.error('Failed to encrypt data:', error);
      return null;
    }
  };

  const decryptData = async (encryptedData: Record<string, any>): Promise<Record<string, any> | null> => {
    if (!user) return null;
    
    try {
      return await encryptionService.decryptUserData(user.id, encryptedData);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  };

  const createDataFingerprint = async (data: Record<string, any>): Promise<string | null> => {
    try {
      return await encryptionService.createDataFingerprint(data);
    } catch (error) {
      console.error('Failed to create data fingerprint:', error);
      return null;
    }
  };

  const validateDataIntegrity = async (data: string, expectedHash: string): Promise<boolean> => {
    try {
      return await encryptionService.validateDataIntegrity(data, expectedHash);
    } catch (error) {
      console.error('Failed to validate data integrity:', error);
      return false;
    }
  };

  const generateSecureToken = (length?: number): string => {
    return encryptionService.generateSecureToken(length);
  };

  const hashData = async (data: string): Promise<string | null> => {
    try {
      return await encryptionService.hash(data);
    } catch (error) {
      console.error('Failed to hash data:', error);
      return null;
    }
  };

  // Computed properties
  const isEncryptionEnabled = settings?.encryptionEnabled || false;
  const keyRotationNeeded = settings ? new Date() >= settings.nextKeyRotation : false;
  const daysUntilKeyRotation = settings 
    ? Math.max(0, Math.ceil((settings.nextKeyRotation.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    // State
    settings,
    loading,
    keyRotating,
    
    // Actions
    loadEncryptionSettings,
    updateEncryptionSettings,
    toggleEncryption,
    rotateEncryptionKey,
    encryptData,
    decryptData,
    createDataFingerprint,
    validateDataIntegrity,
    generateSecureToken,
    hashData,
    
    // Computed properties
    isEncryptionEnabled,
    keyRotationNeeded,
    daysUntilKeyRotation,
  };
};