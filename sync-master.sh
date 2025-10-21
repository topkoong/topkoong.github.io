#!/bin/bash

# Sync Master Branch Script
# This script ensures that the master branch always follows the main branch
# Run this script whenever you want to sync master with main

set -e  # Exit on any error

echo "🔄 Syncing master branch with main..."

# Ensure we're on main branch
git checkout main

# Pull latest changes from remote main
echo "📥 Pulling latest changes from origin/main..."
git pull origin main

# Switch to master branch
echo "🌿 Switching to master branch..."
git checkout master

# Reset master to match main exactly
echo "🔄 Resetting master to match main..."
git reset --hard main

# Push the updated master branch to remote
echo "📤 Pushing updated master to origin/master..."
git push origin master --force-with-lease

# Switch back to main
echo "✅ Switching back to main branch..."
git checkout main

echo "🎉 Master branch successfully synchronized with main!"
echo ""
echo "📊 Branch Status:"
echo "   Main:   $(git log --oneline -1 main)"
echo "   Master: $(git log --oneline -1 master)"
echo ""
echo "💡 Tip: Consider setting up a GitHub Action to automate this process."
