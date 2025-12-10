#!/usr/bin/env bash
set -euo pipefail
# Simple helper to sync packages/core from origin/main into a working branch
# and push it to your fork. Run from repository root or execute this script directly.

REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$REPO_ROOT"

SOURCE_REF="origin/main"
WORKING_BRANCH="update-core-from-origin-main"
BACKUP_PREFIX="backup/dev-before-sync"
PUSH_REMOTE="my"
PUSH_TO_BRANCH="dev"
DRY_RUN=0

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Options:
  -s <source-ref>     Source ref to copy packages/core from (default: origin/main)
  -b <branch>         Working branch name (default: update-core-from-origin-main)
  -r <push-remote>    Remote to push to (default: my)
  -t <push-branch>    Branch name to push to on remote (default: dev)
  -n                  Dry run (don't push)
  -h                  Show this help
EOF
}

while getopts "s:b:r:t:nh" opt; do
  case $opt in
    s) SOURCE_REF="$OPTARG" ;;
    b) WORKING_BRANCH="$OPTARG" ;;
    r) PUSH_REMOTE="$OPTARG" ;;
    t) PUSH_TO_BRANCH="$OPTARG" ;;
    n) DRY_RUN=1 ;;
    h) usage; exit 0 ;;
    *) usage; exit 1 ;;
  esac
done

echo "Repo: $REPO_ROOT"
echo "Source: $SOURCE_REF -> branch: $WORKING_BRANCH -> push: $PUSH_REMOTE/$PUSH_TO_BRANCH"

# Ensure remotes exist
if ! git remote | grep -q "^origin$"; then
  echo "Remote 'origin' not found. Please add official remote as 'origin'." >&2
  exit 1
fi
if ! git remote | grep -q "^${PUSH_REMOTE}$"; then
  echo "Remote '${PUSH_REMOTE}' not found. Please add your fork remote as '${PUSH_REMOTE}'." >&2
  exit 1
fi

echo "Fetching origin..."
git fetch origin --prune

echo "Checking out working branch: $WORKING_BRANCH"
# create or switch to working branch
if git show-ref --verify --quiet refs/heads/$WORKING_BRANCH; then
  git checkout $WORKING_BRANCH
else
  git checkout -b $WORKING_BRANCH
fi

timestamp=$(date +%s)
backup_branch="$BACKUP_PREFIX-$timestamp"
echo "Creating backup branch: $backup_branch"
git branch -f "$backup_branch"

echo "Checking out $SOURCE_REF -- packages/core"
git checkout "$SOURCE_REF" -- packages/core

echo "Staging changes..."
git add packages/core

if git diff --staged --quiet; then
  echo "No changes in packages/core (already up-to-date)."
else
  msg="chore(core): sync from $SOURCE_REF"
  git commit -m "$msg"
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "Dry run: skipping push. To push, rerun without -n."
  else
    echo "Pushing $WORKING_BRANCH to $PUSH_REMOTE/$PUSH_TO_BRANCH"
    git push "$PUSH_REMOTE" "$WORKING_BRANCH:$PUSH_TO_BRANCH"
  fi
fi

echo "Done."
