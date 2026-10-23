# Applying this portfolio to the existing GitHub Pages repository

This archive is a source overlay. It does not contain copies of the private/local assets or the legacy POC files because those originals were not available in the generation environment.

1. Clone `https://github.com/alrbughunt/alrbughunt.github.io.git` and create a branch from the default branch:

   ```bash
   git clone https://github.com/alrbughunt/alrbughunt.github.io.git
   cd alrbughunt.github.io
   git switch -c 3d-portfolio
   ```

2. Extract the archive into the repository root. Allow the new `index.html`, `package.json`, source files, and workflow to be added or updated. The archive does not include `poc.html`, `poc1.html`, `poc2.html`, or `download-test.html`, so their source copies remain untouched.

3. Install dependencies and copy the existing root assets into `public/`:

   ```bash
   npm install
   npm run preserve:assets
   npm run build
   ```

4. Check `git status`. Confirm all four POC files still have the same contents as before and verify that `public/` contains the CV, portfolio PDF, photo, and POC copies. The preservation script copies, rather than deletes or edits, source files.

5. Inspect the site in a browser at 360 px and 1440 px, check the browser console, and run Lighthouse mobile. Fix any errors before committing.

6. Commit and push the branch, then create a pull request. Do not force-push and do not rewrite Git history.

   ```bash
   git add -A
   git commit -m "Build Alfarizqi 3D portfolio"
   git push -u origin 3d-portfolio
   ```

7. After the pull request is merged, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions** if it is not already selected. Confirm the deployment workflow succeeds.
