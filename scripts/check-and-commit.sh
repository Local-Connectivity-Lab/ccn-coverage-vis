#!/usr/bin/env bash

set -euo pipefail

GIT_BRANCH="${GITHUB_REF/refs\/heads\//}"
git checkout $GIT_BRANCH

echo "On branch $GIT_BRANCH."

echo ""
echo "------- Checking Code Formatting -------"
echo ""


if [[ $GIT_BRANCH != 'main' ]]; then
  ## commit prettier changes if outdated
  if ! git diff --exit-code src
  then
    git add --all
    git commit -m "style: auto-formatting [CI]"
  fi

  # should be empty
  git status

  # Then push all the changes
  git pull --rebase origin ${GITHUB_REF}
  git push origin ${GITHUB_REF}
fi

exit 0