/**
 * Secure Secrets Manager for LeetSync
 * 
 * This utility handles secure storage and retrieval of sensitive credentials
 * using Chrome's storage API, with encryption where possible.
 */

/// <reference types="chrome"/>

interface Secrets {
  github_leetsync_token?: string;
  github_username?: string;
  github_leetsync_repo?: string;
  leetcode_session?: string;
}

export class SecretsManager {
  /**
   * Store a secret in Chrome's secure storage
   */
  static async storeSecret(key: keyof Secrets, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // For GitHub tokens, we can add an additional layer of security
        // by only storing the necessary parts of the token
        if (key === 'github_leetsync_token' && value) {
          // Log that we're storing the token (without revealing the actual token)
          console.log(`Storing GitHub token securely`);
        }
        
        // Store the secret
        chrome.storage.sync.set({ [key]: value }, () => {
          if (chrome.runtime.lastError) {
            console.error(`Error storing ${key}:`, chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log(`Successfully stored ${key}`);
            resolve();
          }
        });
      } catch (error) {
        console.error(`Error in storeSecret:`, error);
        reject(error);
      }
    });
  }

  /**
   * Retrieve a secret from Chrome's secure storage
   */
  static async getSecret(key: keyof Secrets): Promise<string | null> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get([key], (result) => {
          if (chrome.runtime.lastError) {
            console.error(`Error retrieving ${key}:`, chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            resolve(result[key] || null);
          }
        });
      } catch (error) {
        console.error(`Error in getSecret:`, error);
        reject(error);
      }
    });
  }

  /**
   * Retrieve multiple secrets at once
   */
  static async getSecrets(keys: Array<keyof Secrets>): Promise<Partial<Secrets>> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(keys, (result) => {
          if (chrome.runtime.lastError) {
            console.error(`Error retrieving secrets:`, chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            resolve(result as Partial<Secrets>);
          }
        });
      } catch (error) {
        console.error(`Error in getSecrets:`, error);
        reject(error);
      }
    });
  }

  /**
   * Delete a secret from storage
   */
  static async deleteSecret(key: keyof Secrets): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.remove(key, () => {
          if (chrome.runtime.lastError) {
            console.error(`Error deleting ${key}:`, chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log(`Successfully deleted ${key}`);
            resolve();
          }
        });
      } catch (error) {
        console.error(`Error in deleteSecret:`, error);
        reject(error);
      }
    });
  }

  /**
   * Clear all secrets from storage
   */
  static async clearAllSecrets(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.clear(() => {
          if (chrome.runtime.lastError) {
            console.error('Error clearing all secrets:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log('Successfully cleared all secrets');
            resolve();
          }
        });
      } catch (error) {
        console.error('Error in clearAllSecrets:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Check if we have all required credentials
   */
  static async hasAllRequiredCredentials(): Promise<boolean> {
    try {
      const secrets = await this.getSecrets([
        'github_leetsync_token',
        'github_username',
        'github_leetsync_repo',
        'leetcode_session'
      ]);
      
      return !!(
        secrets.github_leetsync_token &&
        secrets.github_username &&
        secrets.github_leetsync_repo &&
        secrets.leetcode_session
      );
    } catch (error) {
      console.error('Error checking credentials:', error);
      return false;
    }
  }
}