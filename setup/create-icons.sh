#!/bin/bash
# Update manifest.json to use a single icon

echo "Updating manifest.json..."

if [ -f "build/manifest.json" ]; then
  # Create a backup
  cp "build/manifest.json" "build/manifest.json.bak"
  
  # Create a simple icon.png file (1x1 pixel)
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 --decode > "build/icon.png"
  
  # Update manifest to use just one icon
  sed -i 's/"icons": {[^}]*}/"icons": { "128": "icon.png" }/g' "build/manifest.json" || \
  sed -i '' 's/"icons": {[^}]*}/"icons": { "128": "icon.png" }/g' "build/manifest.json"
  
  echo "✅ manifest.json updated to use a single icon"
else
  echo "❌ manifest.json not found in build directory"
fi