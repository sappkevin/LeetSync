#!/bin/bash
# Script to check TypeScript files for syntax errors

echo "=== TypeScript Syntax Checker ==="

# Check if npx is available
if ! command -v npx &> /dev/null; then
  echo "npx is not installed. Please install Node.js and npm."
  exit 1
fi

# Function to check a specific file
check_file() {
  echo "Checking $1..."
  npx tsc --noEmit --skipLibCheck "$1"
  
  if [ $? -eq 0 ]; then
    echo "✅ No syntax errors found in $1"
  else
    echo "❌ Syntax errors found in $1"
  fi
}

# Check if a file was specified
if [ "$1" ]; then
  # Check the specified file
  check_file "$1"
else
  # Check all TypeScript files if no specific file was given
  echo "Checking all TypeScript files..."
  
  files=$(find ./src -name "*.ts" -o -name "*.tsx")
  
  for file in $files; do
    check_file "$file"
  done
fi

echo "=== Syntax check completed ==="