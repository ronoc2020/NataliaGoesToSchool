# Natalia Goes to School — Ochojno Adventure

A small **playable** 2D browser game inspired by a fictional walk to school in Ochojno, Poland. Built with **HTML5 Canvas, CSS, and vanilla JavaScript**.

## Play without installation

1. Open the repository's `index.html` locally in a modern desktop or mobile browser.
2. Collect all three notebooks 📚.
3. Reach the school building on the right side of the map.
4. Avoid hedges and fences; beat your best time.

The game has keyboard controls (WASD / arrows), on-screen touch controls, restart and pause. Your best time is saved only to local browser storage.

## Privacy and cost

- No account, cookies, analytics, fonts/CDNs, payments, or network requests.
- No dependencies or build process.
- No GitHub Actions workflows; updating this repository consumes **zero Actions runner minutes**.
- The map is fictional, not a real child route or school map.

## Offline automated tests

No dependencies or GitHub Actions needed. With Node.js 18+:

```bash
node --test test/game.test.mjs
```

The tests check JavaScript syntax, offline-only resources, the full 3-notebook route to the school, high-score saving, pause and restart. A separate browser/device check is still recommended before public release.

## Hosting

The repository now contains a self-contained `index.html` that can be served by any static web server.

To publish with GitHub Pages, open **Settings → Pages**, select **Deploy from a branch**, branch `main`, folder `/ (root)`, then save. Do this only if Pages is allowed on your account; GitHub may still create internal Pages deployment jobs. A manual upload to another static host is also possible.

**Current status:** playable source and offline gameplay tests committed on `main`; public hosting and real-browser visual QA remain unverified.

## Controls

| Control | Action |
| --- | --- |
| WASD / arrow keys | Move Natalia |
| Touch arrows | Move on phone/tablet |
| P | Pause or resume |
| R | Restart |
| On-screen buttons | Pause / new game |

## Scope and extensions

This is the first small standalone level. Character sprites, levels, audio, story scenes, achievements and accessibility enhancements can be added later without a framework.
