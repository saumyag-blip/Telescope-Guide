# Sky Ledger — Telescope Guide

## Project structure
```
telescope-guide/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js     (nav, sky swatches)
│   └── map.js      (Leaflet map: Sky Quality + Telescope Guide modes)
└── README.md
```

## Opening in VS Code
1. Unzip / copy this folder somewhere on your machine.
2. In VS Code: **File → Open Folder…** and select `telescope-guide`.
3. Install the **Live Server** extension (by Ritwick Dey) if you don't have it —
   it gives you a local preview that auto-refreshes as you edit.
4. Right-click `index.html` → **Open with Live Server**. It'll open at something
   like `http://127.0.0.1:5500`.

## Deploying to GitHub Pages
1. Create a new GitHub repo (e.g. `telescope-guide`).
2. In VS Code's terminal, from inside this folder:
   ```
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/telescope-guide.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source** → select the `main` branch, root folder.
4. Your site will be live at `https://<your-username>.github.io/telescope-guide/`
   within a minute or two.

## What's built
- All info sections, hero through footer
- Interactive Leaflet map of the Bangalore region (pilot) with two modes:
  - **Sky Quality**: Bortle markers, dark-sky sites, Bortle legend
  - **Telescope Guide**: zone overlay, aperture bubbles, budget / portability /
    experience / interest / target filters feeding the recommendation panel

## Design tokens (for reference when adding new sections/components)
- Background: `#0A1128` (deep navy, not black)
- Surface/cards: `#101A34`, borders `#253258`
- Text: `#EDEFF6` primary, `#8D97B8` muted
- Accent: always the `teal → amber` gradient (`#2FD9C4` → `#FFB067`) —
  never a solid accent color. This is the site's one signature motif,
  used for the scroll progress bar, section dividers, and the CTA button.
- Type: `Newsreader` (serif, headlines/italics), `IBM Plex Sans` (body),
  `IBM Plex Mono` (labels, stats, eyebrows)

## Next steps
- Replace hand-placed markers with a VIIRS / World Atlas light-pollution tile layer
- Extend beyond Bangalore
- Drive-time isochrones to the nearest dark site (OpenRouteService)
- Weather / cloud-cover integration and saved locations
