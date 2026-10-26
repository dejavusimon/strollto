# Roadmap: from prototype runtime to a real app

Today the app runs the Claude Design file through a small template player (`src/runtime/player.js`). That got it deployed and testable quickly, but it isn't a codebase people can grow: one 560 KB file holds all screens, data and logic. Each step below should land as its own pull request, with `npm run check` green.

## 1. Pull the data out (small)
- Move strolls, stops, community posts, featured picks and the City stroll list out of the logic into `src/data/*.json`.
- Add a `scripts/` importer for the City's StrollTO open data, so stories stay word for word and can be refreshed.
- Keep a test that every stop has a name, coordinates, a story and a credited photo (or `photoSoon`).

## 2. State and routing (medium)
- One store (React context with a reducer) for: saved strolls, the active walk, the plan (skipped stops), compare, stamps and the board.
- Real routes with a hash router, so GitHub Pages needs no server config: `#/`, `#/map`, `#/compare`, `#/stroll/:id`, `#/stroll/:id/stop/:n`, `#/stroll/:id/done`.
- Keep the current query links (`?s=…&skip=…`) working, because QR codes already in the wild use them.

## 3. Rebuild the screens as components (largest)
Work in this order, and remove each screen from the Claude Design template once its component replaces it:
1. Phone stop page (the core walking loop)
2. Phone overview, with Plan your walk
3. Completion, skip sheet and Explore
4. Phone map and compare
5. Website: home, stroll page, map, compare, guide page
6. Missions and stamps, the community board, and the walk buddy (AR placeholder)

Rewrite `src/ds/bundle.js` as ES-module React components with TypeScript types (`index.d.ts` is the starting point).

## 4. App polish
- PWA: a manifest and an offline cache for the stroll being walked, since the PRD asks for offline use.
- Real location: an optional "Near me" mode and arrival hints, with location kept on the device.
- French: string tables, so translators can work outside the code.

## 5. Before a public launch
- Photo permissions, or replacement team photos, for the Street View and third-party images.
- A licence for the code, and attribution for the City data under the Open Government Licence – Toronto.
- An accessibility audit with screen readers on iOS and Android.
