# Ideas Lab

An index of the small products I'm building in public. It's a static site with no build step, no dependencies, no cookies and no tracking.

## Add a project
Edit `projects.js` and add a new object at the end of `PROJECTS`. Put screenshots in `images/` (16:10 works best) and fill in `imageAlt` with a short description of the screenshot.

Status values: `live`, `building`, `prototype`, `paused`.

## Run locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000.

## Deploy (Vercel)
1. On vercel.com, choose **Add New → Project**, import this repo and deploy. No settings are needed.
2. Optional: under **Settings → Domains**, add your own domain.

## Security and privacy
- `vercel.json` sets security headers, including a strict Content Security Policy: only this site's own scripts and styles can run, and the page can't be embedded in other sites.
- Every value from `projects.js` is escaped before it reaches the page, and links must start with `http(s)://`, `mailto:` or be relative.
- No third-party requests: system fonts only, no analytics, no cookies, no forms. That's why there is no cookie banner or privacy policy to accept.

## Logo
The symbol is a lowercase "i": a red square dot (the idea) over an ink stem (the work). In the header it is the first letter of "ideas lab".
- `favicon.svg`: browser tab icon
- `logo.svg` / `logo.png` (800×800): square version for profile pictures
- `logo-thumb.svg` / `logo-thumb.png` (800×800): tighter crop for small thumbnails (Linktree buttons)
- `logo-thumb-dark.svg` / `logo-thumb-dark.png` (800×800): same on ink, for dark backgrounds
- `linktree-banner.svg` / `linktree-banner.png` (1600×900): wide banner for Linktree's Featured layout

Colours: red `#b3341c`, ink `#161513`, paper `#f4f2ee`.
