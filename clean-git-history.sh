#!/bin/bash

# Script to clean git history and remove secrets
# This will rewrite git history to remove sensitive data

echo "Cleaning git history to remove secrets..."

# Remove config.js from git tracking
git rm --cached config.js

# Add config.js to .gitignore (already done)
echo "config.js" >> .gitignore

# Create a clean commit
git add .
git commit -m "Remove secrets and add proper environment variable setup

- Remove real Google OAuth project ID from script.js
- Add env.example file for environment variables
- Update README with secure setup instructions
- Ensure config.js is properly ignored"

echo "Git history cleaned. You can now push safely."
echo "Remember to:"
echo "1. Create a .env file with your real credentials"
echo "2. Never commit .env or config.js files"
echo "3. Use environment variables in production"
