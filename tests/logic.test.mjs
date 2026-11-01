// Fast checks of the prototype logic (no browser): every main screen renders, and the core flows work.
// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = { localStorage: { getItem: () => null, setItem() {} }, location: { hash: '', search: '' } };
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { geolocation: { getCurrentPosition: (ok, err) => err && err() }, clipboard: { writeText: () => Promise.resolve() } } });

const { createPrototype } = await import('../src/generated/prototype.js');
class DCLogic {
  constructor(p) { this.props = p; this.state = {}; }
  setState(p, cb) { if (typeof p === 'function') p = p(this.state); Object.assign(this.state, p); if (cb) cb(); }
}
const M = createPrototype(DCLogic);
const make = (props) => { const c = new M.Component(Object.assign({ persist: false }, props)); return { c, v: () => c.renderVals() }; };

test('every ready stroll renders overview, each stop and completion', () => {
  for (const s of M.STROLLS.filter((x) => !x.sample)) {
    assert.ok(make({ screen: 'overview', strollId: s.id }).v().isOverview, s.id);
    s.stops.forEach((_, i) => assert.equal(make({ screen: 'stop', strollId: s.id, stopIndex: i }).v().st.name, s.stops[i].name));
    assert.ok(make({ screen: 'complete', strollId: s.id, stopIndex: s.stops.length - 1 }).v().isComplete);
  }
});

test('website screens render', () => {
  for (const d of ['home', 'map', 'stroll', 'compare', 'seo']) {
    const v = make({ device: 'desktop', desktopScreen: d, strollId: 'bloorwest', demo: true }).v();
    assert.ok(v.web.on, d);
  }
});

test('walk a stroll end to end with one skip', () => {
  const { c, v } = make({ screen: 'overview', strollId: 'danforth' });
  v().startStroll();
  v().goNext();
  v().skp.open(); v().skp.confirm();
  for (let i = 0; i < 30 && !v().isLast; i++) v().goNext();
  v().goNext();
  const done = v();
  assert.ok(done.isComplete);
  assert.match(done.done.stops, /^14 of 15$/);
  assert.equal(c.state.screen, 'complete');
});

test('a plan cuts stops and travels in the QR link', () => {
  const { v } = make({ device: 'desktop', desktopScreen: 'stroll', strollId: 'danforth', siteUrl: 'https://example.github.io/strollto/' });
  v().plan.presets[1].pick();
  const w = v().web;
  assert.match(w.liveLink, /^https:\/\/example\.github\.io\/strollto\/\?s=danforth&skip=8,9,10,11,12,13,14,15&from=desktop/);
});

test('compare holds 3 on the website and 2 on the phone', () => {
  const web = make({ device: 'desktop', compare: ['guildwood', 'bloorwest', 'danforth'] }).v();
  assert.equal(web.cmp.count, 3);
  const phone = make({ screen: 'compare', compare: ['guildwood', 'bloorwest', 'danforth'] }).v();
  assert.equal(phone.cmp.count, 2);
});

test('team-only notes are not in the build', () => {
  assert.equal(JSON.stringify(M).includes('Mauricio'), false);
});

test('every icon the screens use exists in the design system bundle', async () => {
  const fs = await import('node:fs');
  const bundle = fs.readFileSync(new URL('../src/ds/bundle.js', import.meta.url), 'utf8');
  const proto = fs.readFileSync(new URL('../src/generated/prototype.js', import.meta.url), 'utf8');
  const block = bundle.slice(bundle.indexOf('var PATHS = {'), bundle.indexOf('\n  };', bundle.indexOf('var PATHS = {')));
  const have = new Set([...block.matchAll(/^\s*'?([a-z][a-z-]*)'?\s*:/gm)].map((m) => m[1]));
  const used = new Set();
  for (const m of proto.matchAll(/"StrollTO\.Icon","name":"([a-z][a-z-]*)"/g)) used.add(m[1]);
  for (const m of proto.matchAll(/"icon":"([a-z][a-z-]*)"/g)) used.add(m[1]);
  for (const m of proto.matchAll(/\b(?:icon|heart|catIcon|typeIcon|tagIcon|starIcon)\s*:\s*([^,}\n]+)/g)) for (const q of m[1].matchAll(/'([a-z][a-z-]*)'/g)) used.add(q[1]);
  const missing = [...used].filter((n) => !have.has(n));
  assert.deepEqual(missing, [], 'src/ds/bundle.js is out of date. Missing icons: ' + missing.join(', ') + '. Upload the latest src/ds/bundle.js.');
});
