# LeetSync Chrome Extension

LeetSync is a Chrome extension that enables you to sync your LeetCode problem submissions with a selected GitHub repository. With this extension, you can easily track your coding progress and share your solutions with others on GitHub.

## 🚀 What's New

- **Manifest V3 Compatibility**: Fully updated to work with Chrome's latest extension manifest format
- **Simplified Authentication**: Use a personal access token to connect directly to GitHub
- **Repository Management**: Create a new repository or select an existing one
- **Better Error Handling**: More robust error handling and detailed logging
- **Subdirectory Support**: Organize your solutions in subdirectories within your repo

## 📋 Table of Contents

- [How it Works](#how-it-works)
- [Installation](#installation)
- [Get Started](#get-started)
- [Usage](#usage)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🔄 How it Works

LeetSync utilizes the LeetCode API to fetch your submission data and the GitHub API to create a new file or update an existing one in your selected repository. When you successfully submit a solution on LeetCode, the extension automatically:

1. Detects your submission
2. Fetches the code and metadata
3. Creates or updates files in your GitHub repository
4. Organizes solutions with appropriate directory structure and README files

## 📥 Installation

### From Chrome Web Store

1. Download the latest release of the extension from the [Chrome Web Store](https://chrome.google.com/webstore/detail/leetsync-leetcode-synchro/ppkbejeolfcbaomanmbpjdbkfcjfhjnd?hl=en&authuser=0).
2. Install the extension by clicking the "Add to Chrome" button.

### Manual Installation (Developer Mode)

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Load the extension in Chrome's developer mode from the `build` folder

## 🏁 Get Started

To configure LeetSync, follow these steps:

1. Click on the extension icon in your Chrome toolbar.
2. Create a GitHub personal access token with `repo` scope (a link is provided).
3. Enter your token and connect to GitHub.
4. Select an existing repository or create a new one.
5. Make sure you're logged into LeetCode in your browser.
6. Start solving problems on LeetCode!

## 💻 Usage

1. Solve a problem on LeetCode and submit your solution
2. Once your submission is accepted, LeetSync will automatically:
   - Create a directory for the problem
   - Add your solution file with the correct language extension
   - Generate a README with the problem description
   - Include runtime and memory usage stats
3. Check your GitHub repository to see your synchronized solutions

### Customization Options

- **Subdirectories**: Organize your solutions by topic, difficulty, or any custom structure
- **Notes**: Add personal notes that will be saved alongside your solutions
- **Repository Management**: Change or unlink repositories as needed

## 🔒 Security

LeetSync takes security seriously:

- Your GitHub personal access token is stored securely in Chrome's extension storage
- You can create a token with minimal permissions (just `repo` scope)
- The extension only accesses the repositories you explicitly select
- No data is sent to any third-party servers

## 🤝 Contributing

Contributions are welcome! If you want to contribute to the project, please follow the [contributing guidelines](CONTRIBUTING.md).

## 📦 Development

To set up the project for development:

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

## ❓ Troubleshooting

### No solutions appearing in GitHub

1. **Check if submission was successful**: Only accepted (green) submissions are synced
2. **Verify your GitHub token**: Make sure it has the `repo` scope
3. **Check console logs**: Right-click the extension icon > Inspect > Console
4. **Check if logged into LeetCode**: Make sure you're logged into LeetCode in your browser
5. **Reset and try again**: In the extension settings, use the "Reset All" option and set up again

### Submission detection issues

1. **Refresh the LeetCode page**: If you don't see the fire icon after a successful submission, try refreshing the page
2. **Check if content script is loaded**: Look for "LeetSync: Content script loaded" in the console
3. **Try submitting again**: Sometimes network issues can cause a missed submission

## 📄 License

LeetSync is licensed under the [MIT License](LICENSE).

---

Having issues? [Open an issue](https://github.com/3ba2ii/leet-sync/issues) on the GitHub repository.

Made with ❤️ by [@3ba2ii](https://github.com/3ba2ii)