#!/bin/bash
# Build script for LeetSync extension

echo "=== Starting LeetSync build process ==="

# Update browserslist database
echo "Updating browserslist database..."
npx update-browserslist-db@latest

# Install dependencies if needed
echo "Checking for missing dependencies..."
npm install

# Clean build directory
echo "Cleaning previous build..."
rm -rf build/

# Build the extension
echo "Building extension..."
INLINE_RUNTIME_CHUNK=false npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "=== Build completed successfully! ==="
  echo "Your extension is ready in the build/ directory."
  echo "You can load it in Chrome by going to chrome://extensions/ and clicking 'Load unpacked'"
else
  echo "=== Build failed ==="
  echo "Please check the error messages above."
fi