Built in react!




-- for me--

Deployment becomes extremely simple

From now on, workflow will be:

Edit project

For example:

src/data/articles/...

or:

src/data/treeRegistry.js

or:

src/components/...

Then test locally:

npm run dev

When happy:

git add .

git commit -m "Update site"

git push

That's it.

GitHub sees the push:

git push
   ↓
GitHub Actions
   ↓
npm ci
   ↓
npm run build
   ↓
dist/
   ↓
GitHub Pages

Live website gets updated automatically.

GitHub explicitly supports this model of publishing every push to main through Actions.