# Publishing LeetSync to the Chrome Web Store

This guide outlines the steps to publish your LeetSync extension to the Chrome Web Store.

## Prerequisites

1. A Google Developer account (requires a one-time $5 registration fee)
2. A completed, tested build of the LeetSync extension
3. Promotional images and screenshots for the store listing

## Step 1: Prepare Your Extension Package

1. Update the version number in `manifest.json` if needed
2. Build the extension:
   ```bash
   npm run build
   ```
3. Create a ZIP file of the `build` directory (not the directory itself, but its contents)
   - On Windows: Select all files in the build folder, right-click > Send to > Compressed (zipped) folder
   - On Mac: Select all files in the build folder, right-click > Compress items
   - On Linux: `cd build && zip -r ../leetsync.zip *`

## Step 2: Create Your Developer Account

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
2. Sign in with your Google account
3. Complete the registration process and pay the one-time $5 fee if you haven't already

## Step 3: Create a New Item

1. Click "New Item" in the dashboard
2. Upload your ZIP file and wait for it to process

## Step 4: Complete the Store Listing

Fill in the following details for your extension:

### Basic Information
- **Name**: LeetSync
- **Summary**: Automatically sync your LeetCode solutions to GitHub
- **Detailed Description**: Copy from README.md, focusing on features and benefits
- **Category**: Developer Tools
- **Language**: English (or add multiple languages if available)

### Graphics
- **Store Icon**: Upload a 128x128 PNG icon
- **Screenshots**: At least 1, up to 5 screenshots (1280x800 or 640x400)
- **Promotional Tiles** (optional but recommended):
  - Small: 440x280 PNG
  - Large: 920x680 PNG
  - Marquee: 1400x560 PNG

### Additional Information
- **Website**: Your GitHub repository URL
- **Privacy Policy**: Create a simple privacy policy explaining data usage
  - What data is collected (GitHub token, LeetCode session)
  - How it's stored (browser extension storage)
  - How it's used (to sync solutions to GitHub)
  - Third-party access (none)

## Step 5: Specify Visibility and Pricing

1. Choose visibility options:
   - Public: Available to everyone
   - Unlisted: Only accessible with direct link
   - Private: Limited to specific accounts
2. Select "Free" for the price

## Step 6: Submit for Review

1. Review all information for accuracy
2. Click "Submit for Review"
3. The review process typically takes 1-3 business days

## Step 7: Respond to Reviewer Feedback

If the reviewers have questions or concerns:

1. Make necessary changes to your extension
2. Update your package and re-upload
3. Provide detailed responses to reviewer questions

## Once Published

After your extension is approved and published:

1. Share the Chrome Web Store link with users
2. Consider promoting it in relevant communities
3. Monitor user feedback and reviews
4. Plan for future updates and improvements

## Tips for Approval

1. **Be Transparent**: Clearly explain what your extension does and what permissions it needs
2. **Privacy First**: Don't collect more data than necessary
3. **Clear Descriptions**: Make sure your store listing clearly explains the extension's functionality
4. **Quality Screenshots**: Show the extension in action with clear, helpful screenshots
5. **Complete Testing**: Ensure there are no obvious bugs or issues

## Updating Your Extension

To publish updates:

1. Increment the version number in `manifest.json`
2. Make your code changes
3. Build and ZIP the updated package
4. Go to your item in the Chrome Web Store Developer Dashboard
5. Click "Package" > "Upload new package"
6. Submit for review again (updates usually have a faster review time)
