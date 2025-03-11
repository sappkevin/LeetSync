#!/bin/bash
# Script to fix common TypeScript/JSX issues and build the extension

set -e # Exit on error

echo "=== LeetSync TypeScript Fix & Build Script ==="
echo "This script will fix common TypeScript/JSX issues and build the extension"

# Step 1: Update browserslist database
echo -e "\n📦 Updating browserslist database..."
npx update-browserslist-db@latest

# Step 2: Ensure all dependencies are installed
echo -e "\n📦 Installing dependencies..."
npm install

# Step 3: Fix tsconfig.json
echo -e "\n🔧 Fixing tsconfig.json..."
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["chrome"]
  },
  "include": ["src", "webpack.config.js"]
}
EOL
echo "✅ tsconfig.json updated"

# Step 4: Create assets directory if it doesn't exist
echo -e "\n📁 Ensuring assets directory exists..."
mkdir -p src/assets
touch src/assets/.gitkeep

# Step 5: Create type declaration files
echo -e "\n📝 Creating type declaration files..."

# React imports declaration
mkdir -p src/types
cat > src/types/react-imports.d.ts << 'EOL'
/// <reference types="react" />

// This declaration file helps TypeScript understand React modules properly
declare module 'react' {
  // Re-export everything from the React module for easier imports
  export = React;
  export as namespace React;
}
EOL

# Image imports declaration
cat > src/types/images.d.ts << 'EOL'
declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}
EOL

echo "✅ Type declaration files created"

# Step 6: Fix chrome-api.ts
echo -e "\n🔧 Fixing chrome-api.ts..."
# Find the file first
CHROME_API_PATH=$(find ./src -name "chrome-api.ts")
if [ -n "$CHROME_API_PATH" ]; then
  # Use sed to fix the getCookie function
  sed -i'.bak' 's/getCookie(details: { url?: string; name: string; storeId?: string })/getCookie(details: chrome.cookies.Details)/g' "$CHROME_API_PATH"
  rm -f "${CHROME_API_PATH}.bak"
  echo "✅ Fixed chrome-api.ts"
else
  echo "⚠️ Could not find chrome-api.ts"
fi

# Step 7: Clean cache and build directories
echo -e "\n🧹 Cleaning build directories and cache..."
rm -rf node_modules/.cache
rm -rf build

# Step 8: Build the extension
echo -e "\n🔨 Building extension..."
INLINE_RUNTIME_CHUNK=false npm run build

# Check build result
if [ $? -eq 0 ]; then
  echo -e "\n✅ Build completed successfully!"
  echo "Your extension is ready in the build/ directory"
else
  echo -e "\n❌ Build failed"
  echo "Please check the error messages above"
  exit 1
fi

echo -e "\n🚀 Next Steps:"
echo "1. Open Chrome and navigate to chrome://extensions/"
echo "2. Enable \"Developer mode\""
echo "3. Click \"Load unpacked\" and select the build folder"
echo "4. Test the extension"