PHOTOGRAPHY SLOTS — "The Press Room"
====================================

Drop your photos into this folder with these exact filenames. The UI is
already fully styled with warm, art-directed fallbacks, so pages look
complete until the files land. When a file appears, it simply replaces the
fallback.

Required slots:

  hero-landscape.jpg   — Hero / dashboard hero band. Wide, cinematic, warm
                         editorial tone. Suggested 1920x1080.
  hero-portrait.jpg    — Landing hero portrait column. Suggested 3:4 or 4:5.
  editorial-band.jpg   — Full-bleed editorial quote band. Wide 21:9-ish.

Recommended styles (match the visual world):
  - Warm ivory / golden-hour light, charcoal shadows
  - Cinematic film look: soft highlights, gentle grain, muted color
  - Subjects: landscape, relief work, monsoon/cyclone season, aftermath
  - Portrait or landscape orientation as listed above
  - Landscape: 2–5 MB JPEG/WebP is plenty; keep under ~500 KB ideally

Notes:
  - Keep filenames EXACTLY as listed (case-sensitive on some hosts).
  - .jpg is referenced; .webp also works if you edit the URL in
    src/app/globals.css (.film-slot rules) and landing-page.tsx.
  - The slots use CSS fallback layers (radial light, gradient, vignette) so
    a missing photo never looks broken.
