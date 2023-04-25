#!/bin/bash
DIST='./dist'

# Semantic-release needs the package.json to be present
# So we copy it the old package.json (before the version is updated)
# Then we copy the new package.json over again.
function populate_dist() {
  echo "Populating dist folder with relevant files"
  $(cp ./package.json ./${DIST}/package.json)
  $(cp ./README.md ./${DIST}/README.md)
}
if [ ! -d "$DIST" ]; then
  mkdir ${DIST}
  populate_dist
else
  populate_dist
fi
