/**
 * Constants for LeetSync
 * 
 * IMPORTANT: Do not include actual secret values in this file.
 * Either use environment variables during build time or fetch secrets
 * from the GitHub OAuth provider during runtime.
 */

// GitHub OAuth Configuration
// These values should be set via environment variables during build
// and replaced by the bundler
export const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || '';
export const GITHUB_REDIRECT_URI = process.env.REACT_APP_GITHUB_REDIRECT_URI || 'https://github.com/?referrer=leetsync';

// API Endpoints
export const LEETCODE_GRAPHQL_API_URL = 'https://leetcode.com/graphql';
export const GITHUB_API_URL = 'https://api.github.com';
export const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

// Extension constants
export const EXTENSION_VERSION = process.env.REACT_APP_VERSION || '1.0.0';
export const EXTENSION_NAME = 'LeetSync';

/**
 * To use environment variables with create-react-app, create a .env file at the root 
 * of your project with the following variables:
 * 
 * REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
 * REACT_APP_GITHUB_REDIRECT_URI=https://github.com/?referrer=leetsync
 * 
 * The variables will be injected at build time.
 * 
 * DO NOT add GITHUB_CLIENT_SECRET to any frontend code or .env files. This should 
 * only be managed on your backend service that handles the OAuth token exchange.
 */