/// <reference types="react" />

// This declaration file helps TypeScript understand React modules properly
declare module 'react' {
  // Re-export everything from the React module for easier imports
  export = React;
  export as namespace React;
}
