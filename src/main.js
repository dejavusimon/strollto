// Page shell: picks the view, mounts the prototype, and wires the help and start-over buttons.
//
// Views
//   computer   the website filling the browser window (at least 1200 x 680, scaled down below that). The real
//              address bar, Back and Forward follow its pages (?page=…&stroll=…). Its QR code opens the phone view.
//   phone      the phone app, full screen. Used on small screens, or on any screen when the link
//              carries a stroll (?s=…), a compare (?cmp=…) or a screen (?screen=…).
// Force one with ?view=phone or ?view=computer.
import './setup-globals.js';
import './ds/bundle.js';
import './ds/tokens.css';
import './ds/bundle.css';
import './page.css';
import './generated/prototype.css';
import { mountPrototype } from './runtime/player.js';

const STORE_KEY = 'strollto.prototype.v3'; // must match STROLL_KEY in design/Main.dc.html
const params = new URLSearchParams(location.search);
const forced = params.get('view');
const deepLink = () => ['s', 'cmp', 'screen'].some((k) => params.has(k));
// A website link (?page=stroll&stroll=…) opened on a phone opens that stroll in the phone app.
if (!params.has('s') && params.get('stroll') && matchMedia('(max-width: 760px)').matches && params.get('view') !== 'computer') {
  history.replaceState(null, '', location.pathname + '?s=' + encodeURIComponent(params.get('stroll')));
  params.set('s', params.get('stroll'));
}
const small = matchMedia('(max-width: 760px)').matches;
const phoneView = forced === 'phone' || (forced !== 'computer' && (small || deepLink()));
const fullScreenPhone = phoneView && small;
// Running as the installed app (Android: installed from Chrome; iPhone: added to the home screen). ?app=1 fakes it for testing.
const iosNative = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const installed = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true || params.get('app') === '1';

// The site's own address: QR codes and copied links point here.
const siteUrl = location.origin + location.pathname.replace(/index\.html$/, '');
const hosted = /^https?:/.test(location.protocol);

document.documentElement.dataset.view = fullScreenPhone ? 'phone' : phoneView ? 'phone-framed' : 'computer';
document.getElementById('help-computer').hidden = phoneView;
document.getElementById('help-phone').hidden = !phoneView;

const frame = document.getElementById('frame');
const fit = document.getElementById('fit');
const bar = document.querySelector('.pg-bar');

function siteSize() {
  return { vw: Math.max(1200, window.innerWidth), vh: Math.max(680, window.innerHeight - bar.offsetHeight) };
}

// Full-screen phone: the page's layout (fixed to the screen edges) sets the app's size, and the app reads it back.
// No height is ever guessed from the window, so the keyboard, a turn or the toolbar can't leave a strip or push buttons off screen.
function phoneSize() {
  const probe = document.getElementById('inset-probe');
  const insetBottom = probe ? parseFloat(getComputedStyle(probe).paddingBottom) || 0 : 0;
  const r = frame.getBoundingClientRect();
  return { frameWidth: Math.round(r.width) || Math.min(window.innerWidth, 560), frameHeight: Math.round(r.height) || Math.max(520, window.innerHeight - bar.offsetHeight), insetTop: 0, insetBottom };
}

const props = phoneView
  ? Object.assign({ demo: true, persist: true, installed, sysBack: true, iosNative }, fullScreenPhone ? Object.assign({ bare: true, frameCss: '100%' }, phoneSize()) : { frameHeight: 812 })
  : Object.assign({ device: 'desktop', demo: true, siteUrl: hosted ? siteUrl : '', realBrowser: true }, siteSize());

const app = mountPrototype(frame, { props });

let lastH = 0, lastW = 0;
function layout() {
  if (fullScreenPhone) { const z = phoneSize(); if (z.frameHeight !== lastH || z.frameWidth !== lastW) { lastH = z.frameHeight; lastW = z.frameWidth; app.setProps(z); } return; }
  if (!phoneView) {
    // the website fills the window under the prototype bar; narrower or shorter windows scale it down
    const z = siteSize(), k = Math.min(1, window.innerWidth / z.vw, (window.innerHeight - bar.offsetHeight) / z.vh);
    frame.style.width = z.vw + 'px'; frame.style.height = z.vh + 'px'; frame.style.transform = 'scale(' + k + ')';
    fit.style.width = Math.round(z.vw * k) + 'px'; fit.style.height = Math.round(z.vh * k) + 'px';
    app.setProps(z); return;
  }
  const w = phoneView ? 399 : 1440, h = phoneView ? 836 : 900;
  const availW = window.innerWidth - 32, availH = window.innerHeight - bar.offsetHeight - 32;
  const k = Math.min(1, availW / w, Math.max(availH, 480) / h);
  frame.style.width = w + 'px'; frame.style.height = h + 'px';
  frame.style.transform = 'scale(' + k + ')';
  fit.style.width = Math.round(w * k) + 'px'; fit.style.height = Math.round(h * k) + 'px';
}
window.addEventListener('resize', layout);
if (fullScreenPhone && window.ResizeObserver) new ResizeObserver(() => layout()).observe(frame);
if (window.visualViewport) window.visualViewport.addEventListener('resize', layout);
// Phones stay upright: the installed Android app is locked by its manifest (and here, where the browser allows it);
// an iPhone can't be locked by a web page, so a "Turn your phone upright" screen covers the app while it's sideways.
if (phoneView) {
  try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('portrait').catch(() => {}); } catch (e) { /* not allowed here */ }
}
const settle = () => { if (phoneView) window.scrollTo(0, 0); layout(); };
// after typing (the keyboard closes) iOS can leave the page shifted: put it back and re-measure
document.addEventListener('focusout', () => { if (phoneView) { setTimeout(settle, 60); setTimeout(settle, 400); } });
window.addEventListener('pageshow', () => setTimeout(settle, 100));
if (window.visualViewport) window.visualViewport.addEventListener('resize', () => { if (phoneView && !document.activeElement?.matches?.('input, textarea, select')) setTimeout(settle, 120); });
window.addEventListener('orientationchange', () => { setTimeout(settle, 300); setTimeout(settle, 800); setTimeout(settle, 1500); });
layout();

// Help dialog
const help = document.getElementById('help');
function showHelp(on) {
  help.hidden = !on;
  if (on) help.querySelector('[data-close]').focus();
}
// On the website the walking buddy shows how to try it (on Explore); the phone keeps the help pop-up.
let tourReq = 0;
const startTour = () => { tourReq += 1; app.setProps({ tourReq }); };
document.querySelectorAll('[data-help]').forEach((b) => b.addEventListener('click', () => startTour()));
document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => showHelp(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') showHelp(false); });
help.addEventListener('click', (e) => { if (e.target === help) showHelp(false); });

// Start over: forget this browser's progress and drop any link the page was opened with.
document.querySelectorAll('[data-restart]').forEach((b) => b.addEventListener('click', () => {
  try { localStorage.removeItem(STORE_KEY); localStorage.removeItem('strollto.help.seen'); } catch (e) { /* storage blocked */ }
  if (location.search && !forced) { location.href = siteUrl; return; }
  if (forced && location.search !== '?view=' + forced) history.replaceState(null, '', location.pathname + '?view=' + forced);
  app.restart();
  showHelp(false);
}));

// First visit on this device: show the steps once. Arriving from a QR code skips it.
let seen = false;
try { seen = localStorage.getItem('strollto.help.seen') === '1'; localStorage.setItem('strollto.help.seen', '1'); } catch (e) { /* storage blocked */ }
// (the website's buddy greets on every opening by itself)
// the phone's buddy greets on the first opening only (people arriving from a QR code skip it)
if (!seen && !params.has('from') && !deepLink() && phoneView) startTour();
