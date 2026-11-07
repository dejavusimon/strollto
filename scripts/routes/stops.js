const fs = require('fs'), vm = require('vm');
const h = fs.readFileSync(process.argv[2], 'utf8');
const a = h.indexOf('var STROLLS = ['), b = h.indexOf('\n];', a);
const src = h.slice(a, b + 3);
const ctx = {}; vm.createContext(ctx);
try { vm.runInContext(src, ctx); } catch (e) { console.error('ERR', e.message); process.exit(1); }
const out = ctx.STROLLS.filter(s => s.geo && !s.sample).map(s => ({ id: s.id, stops: s.stops.map((t, i) => ({ i, name: t.name, lat: t.lat, lon: t.lon, address: t.address || '', to: t.toNext ? { m: t.toNext.m, min: t.toNext.min, path: t.toNext.path || null, dir: t.toNext.dir || '' } : null })) }));
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
console.log(out.map(s => s.id + ':' + s.stops.length).join(' '));
