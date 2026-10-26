# StrollTO walk companion

A prototype walk companion for the City of Toronto's [StrollTO](https://www.toronto.ca/services-payments/streets-parking-transportation/sidewalk-tours-wayfinding/self-guided-tours/strollto/) self-guided strolls, made by Toronto Metropolitan University Master of Digital Media students as a major research project with the City.

You plan a stroll on the website, scan a QR code to continue on your phone, then walk it with stop stories, a walking-time map, a shorter plan if you want one, and the option to skip stops.

**This is a prototype for review.** The content is sample content, and this is not a City of Toronto service.

- **Try it:** `https://<github-user>.github.io/strollto/` (after the first deploy). One link works for everyone: on a computer it opens the website, and on a phone it opens the phone app.
- **How to test it:** [WALKTHROUGH.md](WALKTHROUGH.md)
- **For developers and Claude Code:** [CLAUDE.md](CLAUDE.md) and [docs/ROADMAP.md](docs/ROADMAP.md)

## Put it on GitHub (first time)

1. On github.com, create a new empty repository called `strollto`. Don't add a README.
2. In this folder, run:
   ```sh
   git remote add origin https://github.com/<github-user>/strollto.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**. Under **Build and deployment → Source**, pick **GitHub Actions**.
4. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to turn green, about a minute. If it ran before step 3, choose **Re-run all jobs**.
5. Your link is `https://<github-user>.github.io/strollto/`.

After that, every push to `main` tests the code and redeploys.

## Work on it

```sh
npm install
npx playwright install chromium   # once, for the browser tests
npm run dev                       # http://localhost:5173
npm run check                     # tests + build + browser tests
```

To bring in a newer version from Claude Design, export `Main.dc.html` from the Claude Design project and run `npm run import -- path/to/Main.dc.html`. The script removes team-only notes and lists any photos that are missing from `public/img/`.

## Before making it more public

The site is public to anyone with the link (including when the repository is private), and it asks search engines not to index it.

- **Photos:** `public/img/` includes Google Street View captures, a TorontoJourney416.com photo, and photos without a confirmed credit. Get permission or replace them before a wider launch. To hide them, pass `hidePhotos: true` to `mountPrototype` in `src/main.js` and delete those files.
- **City identity:** no City of Toronto logo or wordmark without approval from City marketing.
- **Data:** stops and stories come from the City of Toronto's StrollTO open data. Credit the City and follow the Open Government Licence – Toronto.
- **Licence:** none chosen yet, so all rights are reserved by the project team.
