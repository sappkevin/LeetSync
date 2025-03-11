/**
 * Global type declarations for LeetSync
 */

// Ensure TypeScript recognizes the Chrome API
declare namespace chrome {
  export namespace storage {
    export interface StorageArea {
      get(keys?: string | string[] | Object | null): Promise<{ [key: string]: any }>;
      set(items: Object): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    }
    
    export var sync: StorageArea;
    export var local: StorageArea;
    export var session: StorageArea;
    
    export function onChanged(callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void): void;
    
    export interface StorageChange {
      oldValue?: any;
      newValue?: any;
    }
  }
  
  export namespace runtime {
    export interface MessageSender {
      tab?: chrome.tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
    }
    
    export function sendMessage(message: any, responseCallback?: (response: any) => void): void;
    export function sendMessage(extensionId: string, message: any, responseCallback?: (response: any) => void): void;
    export function sendMessage(extensionId: string, message: any, options: any, responseCallback?: (response: any) => void): void;
    
    export function onMessage(callback: (message: any, sender: MessageSender, sendResponse: (response?: any) => void) => void | boolean): void;
    
    export var lastError: {message: string} | undefined;
  }
  
  export namespace tabs {
    export interface Tab {
      id?: number;
      index: number;
      pinned: boolean;
      highlighted: boolean;
      windowId?: number;
      active: boolean;
      url?: string;
      title?: string;
      favIconUrl?: string;
      status?: string;
      incognito: boolean;
      width?: number;
      height?: number;
      sessionId?: string;
    }
    
    export function query(queryInfo: object, callback: (result: Tab[]) => void): void;
    export function sendMessage(tabId: number, message: any, responseCallback?: (response: any) => void): void;
    export function create(createProperties: object, callback?: (tab: Tab) => void): void;
    export function get(tabId: number, callback: (tab: Tab) => void): void;
    export function getCurrent(callback: (tab?: Tab) => void): void;
    export function remove(tabIds: number | number[], callback?: Function): void;
  }
  
  export namespace cookies {
    export interface Cookie {
      name: string;
      value: string;
      domain: string;
      hostOnly: boolean;
      path: string;
      secure: boolean;
      httpOnly: boolean;
      sameSite: string;
      session: boolean;
      expirationDate?: number;
      storeId: string;
    }
    
    export function get(details: {
      url?: string;
      name: string;
      storeId?: string;
    }, callback: (cookie?: Cookie) => void): void;
    
    export function onChanged(callback: (changeInfo: {
      removed: boolean;
      cookie: Cookie;
      cause: string;
    }) => void): void;
  }
  
  export namespace action {
    export function setIcon(details: {
      path?: string | { [size: string]: string };
      imageData?: ImageData | { [size: string]: ImageData };
      tabId?: number;
    }, callback?: () => void): void;
  }
}
