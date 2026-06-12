#!/usr/bin/env bash
# Exit on error
set -e

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$REPO_ROOT/src/deployment/frontend"
DIST_DIR="$FRONTEND_DIR/dist"
TEMP_DIR="$FRONTEND_DIR/dist_temp"

echo "==> Building frontend..."
npm run build --prefix "$FRONTEND_DIR"

echo "==> Preparing temporary deploy workspace..."
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Clone the current local repository gh-pages branch into the temp directory
echo "==> Checking out gh-pages into temporary directory..."
git clone --branch gh-pages --shared "$REPO_ROOT" "$TEMP_DIR"

# Go into the temporary workspace
cd "$TEMP_DIR"

# Remove all existing files in the gh-pages workspace (except .git)
echo "==> Cleaning old deployment files..."
git rm -rf .
git clean -fdx

# Copy the build outputs to the workspace
echo "==> Copying new build files..."
cp -r "$DIST_DIR"/* .

# Create .nojekyll to prevent GitHub Pages from ignoring folders starting with underscore
touch .nojekyll

# Commit the changes
echo "==> Committing new build..."
git add -A
git -c user.name="tblinstance" -c user.email="tblinstance@gmail.com" commit -m "Deploy frontend dist to gh-pages: $(date +'%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

# Force push to the local repository's gh-pages branch to update it
echo "==> Updating local gh-pages branch..."
git push -f origin gh-pages

# Clean up
echo "==> Cleaning up temporary workspace..."
cd "$REPO_ROOT"
rm -rf "$TEMP_DIR"

# Force push the local gh-pages branch to GitHub remote origin
echo "==> Pushing local gh-pages branch to remote origin..."
git push -f origin gh-pages

echo "==> Deployment complete."
