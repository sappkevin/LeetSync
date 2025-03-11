#!/bin/bash
# Script to find syntax errors in TypeScript files

echo "=== Finding TypeScript Syntax Errors ==="

# Check for typescript installation
if ! command -v npx &> /dev/null; then
  echo "npx is not installed. Please install Node.js and npm."
  exit 1
fi

# Function to count braces in a file
count_braces() {
  local file=$1
  local opening=$(grep -o "{" "$file" | wc -l)
  local closing=$(grep -o "}" "$file" | wc -l)
  
  echo "File: $file"
  echo "Opening braces: $opening"
  echo "Closing braces: $closing"
  echo "Difference: $(($opening - $closing))"
  
  if [ $opening -ne $closing ]; then
    echo "⚠️ UNBALANCED BRACES DETECTED ⚠️"
  else
    echo "✅ Braces are balanced"
  fi
  echo ""
}

# Check TypeScript files individually
check_ts_file() {
  local file=$1
  echo "Checking $file..."
  
  # First count the braces
  count_braces "$file"
  
  # Then run TypeScript compiler on the file
  npx tsc --noEmit --skipLibCheck "$file" 2>&1 | grep -A 2 "error TS1005"
  
  if [ $? -eq 0 ]; then
    echo "❌ Syntax error found in $file"
    echo ""
  else
    echo "No TS1005 error found in this file"
    echo ""
  fi
}

# Find all TypeScript and TSX files
FILES=$(find ./src -name "*.ts" -o -name "*.tsx")

# Total files to check
TOTAL=$(echo "$FILES" | wc -l)
echo "Found $TOTAL TypeScript files to check"
echo ""

# Check each file
for file in $FILES; do
  check_ts_file "$file"
done

echo "=== Checking Complete ==="
echo "For files with unbalanced braces, try:"
echo "1. Check the file with VS Code or another editor with brace matching"
echo "2. Look for missing closing braces at the end of classes, functions, or objects"
echo "3. Check for mismatched braces in JSX components"