# Saqlain Newaz Chowdhury — GitHub Pages Portfolio

A lightweight, responsive engineering portfolio built with plain HTML, CSS, and JavaScript. No framework or build step is required.

## Recommended GitHub Pages setup

For the cleanest URL, create a public repository named:

`SaqlainChy.github.io`

Then upload the contents of this folder to the root of that repository.

### Option A — GitHub web interface
1. Sign in to GitHub.
2. Create a new public repository named `SaqlainChy.github.io`.
3. Upload `index.html`, `styles.css`, `script.js`, and the `assets` folder.
4. Commit the files.
5. Open the repository's **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Choose the `main` branch and `/ (root)` folder.
8. Save. The site should appear at `https://saqlainchy.github.io/` after deployment.

### Option B — Git
```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/SaqlainChy/SaqlainChy.github.io.git
git push -u origin main
```

## Before publishing

- Add dates to the Engineering Experience section if you want them displayed.
- Replace or expand project descriptions as you complete more testing.
- Add project photographs, CAD renders, PCB screenshots, or short demo clips when available.
- Keep private/sensitive code or project material out of the public repository.
- Confirm that the résumé PDF in `assets/` is the version you want recruiters to download.

## Suggested future upgrades

- Add a dedicated project gallery page with UAV CAD renders and hardware photos.
- Link each project to a GitHub repository when the code is ready to share publicly.
- Add short demo videos for the UAV, zoom/focus controller, and quadcopter controller.
- Add a custom domain later if desired.
