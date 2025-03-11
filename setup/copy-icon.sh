#!/bin/bash
# Script to copy icon files to the build directory

echo "Copying icon files to build directory..."

# Check if source icons exist
if [ -d "src/assets" ]; then
  # Copy any existing icons
  [ -f "src/assets/logo16.png" ] && cp "src/assets/logo16.png" "build/"
  [ -f "src/assets/logo48.png" ] && cp "src/assets/logo48.png" "build/"
  [ -f "src/assets/logo96.png" ] && cp "src/assets/logo96.png" "build/"
  [ -f "src/assets/logo128.png" ] && cp "src/assets/logo128.png" "build/"
  
  echo "Existing icons copied successfully!"
else
  echo "Source icon directory not found."
fi

# Create placeholder icons if they don't exist
for size in 16 48 96 128; do
  if [ ! -f "build/logo${size}.png" ]; then
    echo "Creating placeholder for logo${size}.png..."
    # This creates a simple solid color PNG
    # You can replace this with proper icon creation if needed
    convert -size ${size}x${size} xc:blue "build/logo${size}.png" 2>/dev/null
    
    if [ $? -ne 0 ]; then
      echo "ImageMagick not available. Creating empty files instead."
      touch "build/logo${size}.png"
    fi
  fi
done

echo "✅ Icon files are now in the build directory!"