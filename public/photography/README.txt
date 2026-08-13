PHOTOGRAPHY SLOTS — "The Press Room"
====================================

The console screenshots from the user's 'web dash' folder are already wired
into these slots. Replace any file with a new version (keep the same name)
and it shows automatically.

Current slot files (PNG, copied from
C:\Users\naren\OneDrive\Pictures\Screenshots\web dash):

  hero-landscape.png  — Landing "Console in Still" gallery (tile 01)
  hero-portrait.png   — Landing hero column + gallery (tile 02)
  editorial-band.png  — Editorial quote band + gallery (tile 03)
  band-secondary.png  — Gallery tile 04

How slots work:
  - Each slot is a CSS background with layered fallbacks (gold light,
    navy gradient, vignette) so nothing ever looks broken.
  - .film-slot* backgrounds are defined in src/app/globals.css.
  - The gallery renders the files as <img> elements in landing-page.tsx.

Recommended if you replace them:
  - Keep the same .png filenames above.
  - Landscape, warm/neutral light, crisp UI — 1–2 MB is plenty.
