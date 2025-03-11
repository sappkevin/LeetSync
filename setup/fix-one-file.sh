#!/bin/bash
# Script to examine and fix a single TypeScript file

if [ $# -ne 1 ]; then
  echo "Usage: $0 <path-to-ts-file>"
  exit 1
fi

FILE_PATH=$1

if [ ! -f "$FILE_PATH" ]; then
  echo "Error: File not found: $FILE_PATH"
  exit 1
fi

echo "=== Analyzing file: $FILE_PATH ==="

# 1. Check file extension
EXTENSION="${FILE_PATH##*.}"
if [ "$EXTENSION" = "ts" ] && grep -q "JSX" "$FILE_PATH"; then
  echo "⚠️ Warning: File contains JSX but has .ts extension"
  echo "   Consider renaming to .tsx"
fi

# 2. Count braces
OPENING=$(grep -o "{" "$FILE_PATH" | wc -l)
CLOSING=$(grep -o "}" "$FILE_PATH" | wc -l)
DIFF=$(($OPENING - $CLOSING))

echo "Brace analysis:"
echo "- Opening braces: $OPENING"
echo "- Closing braces: $CLOSING"
echo "- Difference: $DIFF"

if [ $DIFF -ne 0 ]; then
  echo "⚠️ UNBALANCED BRACES DETECTED ⚠️"
  
  # 3. Analyze the structure of the file
  LAST_EXPORT=$(grep -n "export" "$FILE_PATH" | tail -1 | cut -d: -f1)
  LAST_CLASS=$(grep -n "class" "$FILE_PATH" | tail -1 | cut -d: -f1)
  LAST_INTERFACE=$(grep -n "interface" "$FILE_PATH" | tail -1 | cut -d: -f1)
  LAST_FUNCTION=$(grep -n "function" "$FILE_PATH" | tail -1 | cut -d: -f1)
  
  echo -e "\nFile structure analysis:"
  [ -n "$LAST_EXPORT" ] && echo "- Last export at line: $LAST_EXPORT"
  [ -n "$LAST_CLASS" ] && echo "- Last class at line: $LAST_CLASS"
  [ -n "$LAST_INTERFACE" ] && echo "- Last interface at line: $LAST_INTERFACE"
  [ -n "$LAST_FUNCTION" ] && echo "- Last function at line: $LAST_FUNCTION"
  
  # 4. Show line number of the last opening and closing braces
  LAST_OPEN_LINE=$(grep -n "{" "$FILE_PATH" | tail -1 | cut -d: -f1)
  LAST_CLOSE_LINE=$(grep -n "}" "$FILE_PATH" | tail -1 | cut -d: -f1)
  TOTAL_LINES=$(wc -l < "$FILE_PATH")
  
  echo -e "\nBrace position analysis:"
  echo "- Last opening brace at line: $LAST_OPEN_LINE"
  echo "- Last closing brace at line: $LAST_CLOSE_LINE"
  echo "- Total lines in file: $TOTAL_LINES"
  
  # 5. Show the last few lines of the file
  echo -e "\nLast 10 lines of the file:"
  tail -10 "$FILE_PATH"
  
  # 6. Fix options
  echo -e "\nPossible fixes:"
  
  if [ $DIFF -gt 0 ]; then
    echo "1. Missing closing braces. Try adding $DIFF closing braces at the end:"
    echo "   echo '$(for i in $(seq 1 $DIFF); do echo -n "}"; done)' >> $FILE_PATH"
  else
    echo "1. Too many closing braces. Try removing $((-$DIFF)) closing braces."
  fi
  
  echo "2. Check for unclosed components, functions, or blocks."
  echo "3. Use a code editor with brace matching to find imbalances."
  
  # 7. Ask if the user wants to apply the fix
  if [ $DIFF -gt 0 ]; then
    read -p "Add $DIFF closing braces to the end of the file? (y/n) " ANSWER
    if [ "$ANSWER" = "y" ]; then
      for i in $(seq 1 $DIFF); do
        echo "}" >> "$FILE_PATH"
      done
      echo "✅ Added $DIFF closing braces to $FILE_PATH"
      
      # Check if the file now compiles
      echo -e "\nTesting if file now compiles..."
      if npx tsc --noEmit --skipLibCheck "$FILE_PATH" 2>/dev/null; then
    echo "✅ File compiles successfully!"
  else
    echo "❌ File has syntax errors. Running detailed check..."
    npx tsc --noEmit --skipLibCheck "$FILE_PATH"
  fi
fi

echo -e "\n=== Analysis Complete ==="
echo "If this file still has issues, consider:"
echo "1. Adding the triple-slash reference: /// <reference types=\"chrome\"/>"
echo "2. Adding an empty export statement: export {}"
echo "3. Adding imports for React if using JSX: import React from 'react'"
echo "4. Replacing complex components with simpler versions"
        echo "✅ File compiles successfully!"
      else
        echo "❌ File still has issues. Further debugging needed."
      fi
    fi
  fi
else
  echo "✅ Braces are balanced in this file"
  
  # 8. Check if the file compiles
  echo -e "\nChecking if file compiles..."
  if npx tsc --noEmit --skipLibCheck "$FILE_PATH" 2>/dev/null; then