rm -r ../palmdrop.github.io/artifacts
cp -r dist ../palmdrop.github.io/artifacts

cd ../palmdrop.github.io
git add artifacts
git commit -m "Updated Artifacts"
git push
