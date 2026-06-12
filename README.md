# megjhani.github.io

Personal academic site for **Murad Megjhani, PhD** — Neurocritical Care AI · Music & the Brain.

Hand-written static HTML/CSS/JS (no build step). GitHub Pages serves the files as-is (`.nojekyll`).

## Structure

- `index.html` — homepage; scroll splits a procedural Three.js point-cloud brain into two research hemispheres with a particle signal flow between them
- `projects/` — interactive atlas: brain → split → signal-corridor gallery per research pillar
- `publications/` — 3D brain explorer; each glowing node is a paper (click to open details)
- `teaching/`, `people/` — standard pages
- `assets/js/brain-scene.js`, `projects-gallery.js`, `pub-explorer.js` — Three.js scenes (module imports from jsDelivr CDN)
- `assets/css/main.css` — all styles

## Local preview

```sh
python -m http.server 8181 --bind 127.0.0.1
# open http://127.0.0.1:8181/
```

Dev URL helpers: `?morph=1` (pin homepage split), `?view=lateral|top|front` (pin brain rotation), `?scrollvh=1.2` (jump scroll), `/publications/?open=3` (open paper panel), `/projects/#neuro|#music|#split` (deep-link state).
