// Page shell: picks the view, mounts the prototype, and wires the help and start-over buttons.
//
// Views
//   computer   the website in a 1440 x 900 browser frame, scaled to fit. Its QR code opens the phone view.
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
const deepLink = ['s', 'cmp', 'screen'].some((k) => params.has(k));
const small = matchMedia('(max-width: 760px)').matches;
const phoneView = forced === 'phone' || (forced !== 'computer' && (small || deepLink));
const fullScreenPhone = phoneView && small;

// The site's own address: QR codes and copied links point here.
const siteUrl = location.origin + location.pathname.replace(/index\.html$/, '');
const hosted = /^https?:/.test(location.protocol);

document.documentElement.dataset.view = fullScreenPhone ? 'phone' : phoneView ? 'phone-framed' : 'computer';
document.getElementById('help-computer').hidden = phoneView;
document.getElementById('help-phone').hidden = !phoneView;

const frame = document.getElementById('frame');
const fit = document.getElementById('fit');
const bar = document.querySelector('.pg-bar');

function phoneSize() {
  const probe = document.getElementById('inset-probe');
  const insetBottom = probe ? parseFloat(getComputedStyle(probe).paddingBottom) || 0 : 0;
  return { frameWidth: Math.min(window.innerWidth, 560), frameHeight: Math.max(520, window.innerHeight - bar.offsetHeight), insetTop: 0, insetBottom };
}

const props = phoneView
  ? Object.assign({ demo: true, persist: true }, fullScreenPhone ? Object.assign({ bare: true }, phoneSize()) : { frameHeight: 812 })
  : { device: 'desktop', demo: true, siteUrl: hosted ? siteUrl : '' };

const app = mountPrototype(frame, { props });

function layout() {
  if (fullScreenPhone) { app.setProps(phoneSize()); return; }
  const w = phoneView ? 399 : 1440, h = phoneView ? 836 : 900;
  const availW = window.innerWidth - 32, availH = window.innerHeight - bar.offsetHeight - 32;
  const k = Math.min(1, availW / w, Math.max(availH, 480) / h);
  frame.style.width = w + 'px'; frame.style.height = h + 'px';
  frame.style.transform = 'scale(' + k + ')';
  fit.style.width = Math.round(w * k) + 'px'; fit.style.height = Math.round(h * k) + 'px';
}
window.addEventListener('resize', layout);
layout();

// Help dialog
const help = document.getElementById('help');
function showHelp(on) {
  help.hidden = !on;
  if (on) help.querySelector('[data-close]').focus();
}
document.querySelectorAll('[data-help]').forEach((b) => b.addEventListener('click', () => showHelp(true)));
document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => showHelp(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') showHelp(false); });
help.addEventListener('click', (e) => { if (e.target === help) showHelp(false); });

// Start over: forget this browser's progress and drop any link the page was opened with.
document.querySelectorAll('[data-restart]').forEach((b) => b.addEventListener('click', () => {
  try { localStorage.removeItem(STORE_KEY); } catch (e) { /* storage blocked */ }
  if (location.search && !forced) { location.href = siteUrl; return; }
  app.restart();
  showHelp(false);
}));

// First visit on this device: show the steps once. Arriving from a QR code skips it.
let seen = false;
try { seen = localStorage.getItem('strollto.help.seen') === '1'; localStorage.setItem('strollto.help.seen', '1'); } catch (e) { /* storage blocked */ }
if (!seen && !params.has('from')) showHelp(true);
