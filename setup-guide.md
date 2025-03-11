# LeetSync Setup Guide

This guide will help you set up and configure the LeetSync extension for proper functionality using GitHub personal access tokens.

## Prerequisites

- Node.js (v14 or later) and npm
- A GitHub account
- A GitHub repository where you want to sync your LeetCode solutions (or we can create one for you)
- Chrome browser

## Setup Steps

### 1. Create a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token" and select "Generate new token (classic)"
3. Give your token a descriptive name (e.g., "LeetSync Extension")
4. Select the `repo` scope (this gives access to create/modify files in your repositories)
5. Click "Generate token"
6. **IMPORTANT**: Copy the generated token immediately - you won't be able to see it again!

### 2. Set up the Extension

#### Using the Chrome Web Store (Recommended)

1. Go to the [LeetSync Chrome Web Store page](https://chrome.google.com/webstore/detail/leetsync-leetcode-synchro/ppkbejeolfcbaomanmbpjdbkfcjfhjnd)
2. Click "Add to Chrome"
3. After installation, click the LeetSync icon in your browser toolbar

#### Manual Installation (Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/3ba2ii/leet-sync.git
   cd leet-sync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `build` folder

### 3. Connect to GitHub

1. Click on the LeetSync extension icon in your browser toolbar
2. Paste your GitHub personal access token
3. Click "Connect with GitHub"
4. Once connected, you'll be prompted to select a repository:
   - Choose an existing repository where you want to store your solutions, or
   - Click "Create New Repository" to create a new repository for your solutions

### 4. Log into LeetCode

1. Make sure you're logged into [LeetCode](https://leetcode.com/) in your browser
2. The extension automatically detects your LeetCode session

### 5. Verify Setup

1. Go to any LeetCode problem and submit a correct solution
2. Wait a few seconds for the solution to be processed
3. Check your GitHub repository to see if the solution has been added

## Customization Options

### Setting a Subdirectory

You can organize your solutions in subdirectories:

1. Click on the LeetSync extension icon
2. Click the settings icon in the top right
3. Select "Set a subdirectory"
4. Enter a path like `arrays/easy` or `dynamic-programming`

### Managing Your Repository

To change or unlink your repository:

1. Click on the LeetSync extension icon
2. Click the settings icon in the top right
3. Select "Change or unlink repo"

## Troubleshooting

### Common Issues

1. **Token Invalid**: Ensure your token has the `repo` scope and hasn't expired
2. **Submission Not Detected**: Make sure you're solving problems on leetcode.com (not a different domain)
3. **No Repository Access**: Verify your token has correct permissions for the selected repository
4. **Extension Not Working**: Try reloading the extension from the Chrome extensions page

### Debug Information

If you're experiencing issues:

1. Right-click the LeetSync extension icon
2. Select "Inspect"
3. Go to the Console tab to see detailed logs
4. Share the logs when reporting issues (remember to remove any sensitive information)

## Privacy & Security

- Your GitHub token is stored only in your browser's extension storage
- No data is sent to any third-party servers
- The extension only accesses the repositories you explicitly authorize
- You can revoke the token at any time from your GitHub settings

## Support

If you encounter any issues, please [open an issue](https://github.com/3ba2ii/leet-sync/issues) on the GitHub repository with:

1. A description of the problem
2. Steps to reproduce
3. Any error messages (with sensitive information removed)
4. Your browser and extension version