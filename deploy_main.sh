#!/usr/bin/env bash
# Exit on error
set -e

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

# Get commit message from argument, or prompt, or use default
COMMIT_MSG="$1"
if [ -z "$COMMIT_MSG" ]; then
    # If in an interactive terminal, prompt for message
    if [ -t 0 ]; then
        echo "Enter commit message (press Enter for default: 'Update project: $(date +'%Y-%m-%d %H:%M:%S')'):"
        read -r COMMIT_MSG
    fi
fi

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Update project: $(date +'%Y-%m-%d %H:%M:%S')"
fi

echo "==> Staging all changed files..."
git add -A

echo "==> Committing changes with message: '$COMMIT_MSG'..."
# Use local user config to ensure commit succeeds even in server environments
git -c user.name="tblinstance" -c user.email="tblinstance@gmail.com" commit -m "$COMMIT_MSG" || echo "No changes to commit"

echo "==> Pushing to origin main..."
git push origin main

echo "==> Push to main complete."
