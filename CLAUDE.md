# StrollTO walk companion: notes for Claude Code

A prototype walk companion for the City of Toronto's StrollTO self-guided strolls (TMU Master of Digital Media project with the City). People plan a stroll on the website, hand it to their phone with a QR code, then walk it on the phone. It's a static site, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Commands

- `npm install`, then `npx playwright install chromium` once per computer (for the end-to-end tests)
- `npm run dev`: local server (http://localhost:5173, also on your LAN so a phone on the same Wi-Fi can open it)
- `npm test`: fast logic tests (Node, no browser)
- `npm run build`: re-imports the design and builds `dist/`
- `npm run test:e2e`: browser tests against the build (run `npm run build` first)
- `npm run check`: all of the above, in order. Run it before every push.
- `npm run import -- <path/to/Main.dc.html>`: bring in a newer export from Claude Design

## How it's put together

- `design/Main.dc.html` is the source of truth for screens and behaviour **for now**. It's the Claude Design file: an HTML template (`{{holes}}`, `<sc-if>`, `<sc-for>`, `<x-import>` design-system components) and one `class Component extends DCLogic` with all the state and data.
- `scripts/import-design.mjs` turns it into `src/generated/prototype.js` (template as JSON plus the logic). It also removes team-only blocks (`<sc-if value="{{notDemo}}">`) and checks that every photo exists in `public/img/`. Never edit `src/generated/` by hand.
- `src/runtime/player.js` renders that template with React 18.
- `src/ds/` is the StrollTO design system (tokens, component CSS, components on `window.StrollTO`). `src/setup-globals.js` must load before it.
- `src/main.js` is the page shell. It picks the view: the computer view shows the website filling the browser window (at least 1200 × 680, scaled down below that), with no drawn browser frame; the real address bar, Back and Forward follow its pages and pop-ups (`?page=compare&a=…&pop=add`, `?page=stroll&stroll=…`), so reloads and shared links reopen the same screen. The canvas keeps its drawn 1440 × 900 browser frame. On the website, first visit and How to try it start the walking buddy's how-to on Explore (`tourReq` prop) instead of the help pop-up; the phone keeps the pop-up. The phone view is full screen on small screens, or opens from any link with `?s=`, `?cmp=` or `?screen=`. Force a view with `?view=phone` or `?view=computer`.
- The handoff is just a link. The website builds `<site>/?s=<stroll>&skip=<stops>&from=desktop&saved=<ids>`, and `src/qr.js` draws it as a real QR code. Nothing is sent to a server.

## Rules for content and design (from the team and the PRD)

- Never use "ward", "BIA", "neighbourhood boundary" or "study area" in the interface. Say "shopping street" or the place name. The City's own text can keep "BIA" inside "More about this stop".
- Marigold (the accent colour) is only for rewards and the walk buddy.
- Never invent real people's names or quotes. Sample people and posts are labelled as samples.
- Everything must work without location, camera, the walk buddy or an account.
- WCAG 2.1 AA, with tap targets of at least 44 px. Respect `prefers-reduced-motion`.
- Sample and placeholder content is labelled on screen.
- Privacy (PRD DC15): no personal data, no analytics, and location stays on the device. Progress is kept in this browser's localStorage under `strollto.prototype.v3`.
- Don't add the City of Toronto logo or wordmark (it needs City marketing approval).
- Stop stories are the City's StrollTO open data, word for word. "Look for" lines, titles and hooks are team drafts.
- Photo credits are shown under each photo. Street View and some third-party photos are not cleared yet (see README).

## Where this is heading

`docs/ROADMAP.md` has the plan for replacing the Claude Design runtime with real React components, one screen at a time, while keeping `npm run check` green.
- Installable app: `public/manifest.webmanifest` and `public/icons/` (with Apple tags in `index.html`). Android opens scanned links in the installed app (`handle_links`, `launch_handler`). For iPhone home-screen testing, Send to my phone shows a temporary 4-character plan code (`planCode` / `readPlanCode` in the design file); the installed phone app (`installed` prop, or `?app=1` to fake it) has "Have a code from the website?" on Explore.
- Phone shell: the prototype bar is one slim row (about 37px). On a phone the page is pinned to the screen edges (`body { position: fixed; inset: 0 }`) and the app fills the space under the bar with CSS (`frameCss: '100%'`); its pixel size is only read back (ResizeObserver) for the map, never guessed from the window. The phone buddy how-to starts on the first visit (`tourReq`), and `sysBack` makes Android's back gesture step back inside the app (a guard history entry).
- iPhone (`iosNative` prop): our drawn edge swipe is off and the iPhone's own swipe-back uses the page history. Sideways phones show `#upright` ("Turn your phone upright"); Android also tries `screen.orientation.lock('portrait')` and the manifest says portrait. Start over also clears `strollto.help.seen`, so the phone buddy greets again.
- No page zoom on phones: viewport `user-scalable=no` plus iPhone gesture blocking in `src/main.js`, and `touch-action: pan-x pan-y` on every element in `src/page.css` (at zero specificity, so the maps' own `touch-action: none` wins). Keep it on every element: on html/body alone it stops at the first scrolling area.
