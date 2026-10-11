# Projects hub

A static site that lists everything I'm building. It has no build step and no dependencies.

## Add a project
Edit `projects.js` and copy one object in `PROJECTS`. Put screenshots in `images/` (16:10 works best).

Status values: `live`, `building`, `prototype`, `paused`.

## Run locally
Open `index.html` in a browser.

## Deploy (Vercel)
1. Push this folder to a GitHub repo (e.g. `josemneves/Ideas-Lab`).
2. On vercel.com, choose **Add New → Project**, import the repo and deploy. No settings are needed.
3. Under **Settings → Domains**, add `yourname.com`.
4. Give each project its own subdomain (e.g. `idea1.yourname.com`) from that project's Vercel settings.
