/**
 * Chrome API Helper Utilities
 * 
 * This file provides Promise-based wrappers around Chrome extension APIs
 * to make them easier to use with async/await.
 */

/**
 * Get data from Chrome storage
 */
export function getFromStorage(keys: string | string[] | Record<string, any> | null): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(keys, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Save data to Chrome storage
   */
  export function saveToStorage(items: Record<string, any>): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Remove data from Chrome storage
   */
  export function removeFromStorage(keys: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.remove(keys, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Clear all data from Chrome storage
   */
  export function clearStorage(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.clear(() => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Get a cookie
   */
  export function getCookie(details: chrome.cookies.Details): Promise<chrome.cookies.Cookie | null> {
    return new Promise((resolve, reject) => {
      try {
        chrome.cookies.get(details, (cookie) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(cookie || null);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Send a message to the active tab
   */
  export function sendMessageToActiveTab(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (!tabs.length || !tabs[0].id) {
            reject(new Error('No active tab found'));
            return;
          }
          
          chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Send a message to the background script
   */
  export function sendMessageToBackground(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }