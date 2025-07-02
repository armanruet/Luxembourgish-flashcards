#!/usr/bin/env python3

import re

# Read the file
with open('/Users/arman/Desktop/Flashcard/src/data/main-dag-vocabulary.ts', 'r') as file:
    content = file.read()

# Replace deck property with required properties
pattern = r'deck: [^}]+\n      }'
replacement = '''reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }'''

# Apply the replacement
content = re.sub(pattern, replacement, content)

# Also fix any remaining deck properties at the end of cards
pattern2 = r',\s*deck: [^,\n]+'
replacement2 = ''
content = re.sub(pattern2, replacement2, content)

# Write back to file
with open('/Users/arman/Desktop/Flashcard/src/data/main-dag-vocabulary.ts', 'w') as file:
    file.write(content)

print("Fixed main-dag-vocabulary.ts file")
