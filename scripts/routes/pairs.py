# All-pairs walking routes between a stroll's stops, on the City of Toronto centreline (offline result baked into the app).
import json, math, heapq, sys, os
S = json.load(open(sys.argv[1])); RAW = sys.argv[2]; OUT = sys.argv[3]
R = 6371000.0
def dist(a, b):
    la = math.radians((a[0] + b[0]) / 2); dx = math.radians(b[1] - a[1]) * math.cos(la) * R; dy = math.radians(b[0] - a[0]) * R
    return math.hypot(dx, dy)
def bearing(a, b):
    la = math.radians((a[0] + b[0]) / 2); dx = (b[1] - a[1]) * math.cos(la); dy = b[0] - a[0]
    return math.degrees(math.atan2(dx, dy)) % 360
def compass(b):
    return ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'][int(((b + 22.5) % 360) // 45)]
SPEED = 1.3
def mins(m): return max(1, round(m / SPEED / 60))
def rnd(m): return int(round(m / 10.0) * 10) if m < 100 else int(round(m / 50.0) * 50)
def short(n):
    n = n.replace(' Street', ' St').replace(' Avenue', ' Ave').replace(' Road', ' Rd').replace(' Drive', ' Dr').replace(' Boulevard', ' Blvd').replace(' Crescent', ' Cres').replace(' Parkway', ' Pkwy').replace(' Lane', ' Lane')
    return n
def rdp(pts, eps):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]; dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        p = pts[i]
        # distance from p to segment a-b in metres (local planar)
        ax, ay = 0, 0; bx = (b[1] - a[1]) * 80000; by = (b[0] - a[0]) * 111000; px = (p[1] - a[1]) * 80000; py = (p[0] - a[0]) * 111000
        L = bx * bx + by * by; t = 0 if L == 0 else max(0, min(1, (px * bx + py * by) / L))
        d = math.hypot(px - t * bx, py - t * by)
        if d > dmax: dmax, idx = d, i
    if dmax > eps: return rdp(pts[:idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [a, b]
def build(sid):
    feats = json.load(open(os.path.join(RAW, sid + '.json')))
    nodes = {}; adj = {}; segs = []
    def nid(p):
        k = (round(p[1], 6), round(p[0], 6))
        if k not in nodes: nodes[k] = len(nodes); adj[nodes[k]] = []
        return nodes[k]
    coords = {}
    for name, code, paths in feats:
        pen = 2.5 if code == 201700 else 1.0
        label = ('the access road' if name and name[0].isdigit() else short(name)) if name else ('the path' if code in (204001, 204002) else ('the lane' if code == 201700 else 'the street'))
        for path in paths:
            for i in range(len(path) - 1):
                a, b = (path[i][1], path[i][0]), (path[i + 1][1], path[i + 1][0])
                u, v = nid(path[i]), nid(path[i + 1]); coords[u] = a; coords[v] = b
                d = dist(a, b)
                if d < 0.01: continue
                adj[u].append((v, d * pen, d, label)); adj[v].append((u, d * pen, d, label))
                segs.append((u, v, label, pen))
    return coords, adj, segs
import re
def street_of(addr):
    m = re.match(r'^[\d\-–A-Za-z]*\d[\d\-–A-Za-z]*\s+(.+?)(\s*\(.*)?$', (addr or '').strip())
    return short(m.group(1)).strip() if m else None
def snap(pt, coords, adj, segs, want=None):
    best = None
    pool = [x for x in segs if want and x[2].lower() == want.lower()]
    if pool:
        b2 = None
        for (u, v, label, pen) in pool:
            a = coords[u]; dd = dist(pt, a)
            if b2 is None or dd < b2: b2 = dd
        if b2 is None or b2 > 400: pool = []
    for (u, v, label, pen) in (pool or segs):
        a, b = coords[u], coords[v]
        bx = (b[1] - a[1]) * 80000; by = (b[0] - a[0]) * 111000; px = (pt[1] - a[1]) * 80000; py = (pt[0] - a[0]) * 111000
        L = bx * bx + by * by; t = 0 if L == 0 else max(0, min(1, (px * bx + py * by) / L))
        d = math.hypot(px - t * bx, py - t * by)
        if best is None or d < best[0]: best = (d, u, v, t, label, pen)
    d, u, v, t, label, pen = best
    a, b = coords[u], coords[v]; p = (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
    n = max(coords) + 1; coords[n] = p; adj[n] = []
    for w in (u, v):
        dd = dist(p, coords[w]); adj[n].append((w, dd * pen, dd, label)); adj[w].append((n, dd * pen, dd, label))
    return n, d
def dijkstra(adj, s, t):
    D = {s: 0}; prev = {}; h = [(0, s)]
    while h:
        c, u = heapq.heappop(h)
        if u == t: break
        if c > D.get(u, 1e18): continue
        for v, w, d, lab in adj[u]:
            nc = c + w
            if nc < D.get(v, 1e18): D[v] = nc; prev[v] = (u, d, lab); heapq.heappush(h, (nc, v))
    if t not in prev and t != s: return None
    seq = []; u = t
    while u != s: p, d, lab = prev[u]; seq.append((p, u, d, lab)); u = p
    return seq[::-1]
def directions(steps, to_name, to_n, to_addr):
    # steps: list of [label, metres, start_bearing, end_bearing]
    m = []
    for st in steps:
        if m and (m[-1][0] == st[0] or st[1] < 20):
            m[-1][1] += st[1]; m[-1][3] = st[3]
        else: m.append(list(st))
    if len(m) > 1 and m[0][1] < 20: m[1][1] += m[0][1]; m = m[1:]
    out = []
    for i, (lab, d, b0, b1) in enumerate(m):
        dd = rnd(d)
        if i == 0:
            out.append('Walk %s along %s, about %d m.' % (compass(b0), lab, dd) if lab != 'the path' else 'Follow the path %s, about %d m.' % (compass(b0), dd))
        else:
            turn = (b0 - m[i - 1][3] + 540) % 360 - 180
            word = 'Turn right onto' if turn > 35 else 'Turn left onto' if turn < -35 else 'Continue onto'
            if lab == 'the path': out.append('%s the path, about %d m.' % ('Take' if abs(turn) <= 35 else word.replace(' onto', '') + ' onto', dd))
            else: out.append('%s %s, about %d m.' % (word, lab, dd))
        if len(out) >= 5: break
    out.append('You reach Stop %d, %s%s.' % (to_n, to_name, (' at ' + to_addr) if to_addr and to_addr.lower() not in to_name.lower() else ''))
    return ' '.join(out)
def enc(pts):
    res = []; plat = plng = 0
    for lat, lng in pts:
        for v, pv in ((lat, plat), (lng, plng)):
            d = int(round(v * 1e5)) - int(round(pv * 1e5)); d = ~(d << 1) if d < 0 else (d << 1)
            while d >= 0x20: res.append(chr((0x20 | (d & 0x1f)) + 63)); d >>= 5
            res.append(chr(d + 63))
        plat, plng = lat, lng
    return ''.join(res)
ALL = {}; report = []
for s in S:
    sid = s['id']; stops = s['stops']; n = len(stops)
    coords, adj, segs = build(sid)
    snapped = [snap((t['lat'], t['lon']), coords, adj, segs, street_of(t['address'])) for t in stops]
    res = {}
    for a in range(n):
        for b in range(n):
            if a == b or abs(a - b) == 1: continue
            A, B = (stops[a]['lat'], stops[a]['lon']), (stops[b]['lat'], stops[b]['lon'])
            straight = dist(A, B)
            seq = dijkstra(adj, snapped[a][0], snapped[b][0])
            # chained existing legs (they include park paths the centreline lacks)
            lo, hi = min(a, b), max(a, b); chain = []; cm = 0
            for k in range(lo, hi):
                tn = stops[k]['to']; cm += tn['m']
                p = tn['path'] or [[stops[k]['lat'], stops[k]['lon']], [stops[k + 1]['lat'], stops[k + 1]['lon']]]
                chain += p if not chain else p[1:]
            if a > b: chain = chain[::-1]
            pts = None; m = None; dirs = None; how = ''
            if seq is not None:
                path = [coords[seq[0][0]]] + [coords[x[1]] for x in seq]
                m = sum(x[2] for x in seq) + snapped[a][1] + snapped[b][1]
                if m <= cm * 1.02 or cm == 0:
                    pts = [A] + path + [B]; how = 'net'
                    steps = []; acc = None
                    for (u, v, d, lab) in seq:
                        br = bearing(coords[u], coords[v])
                        if acc and acc[0] == lab: acc[1] += d; acc[3] = br
                        else:
                            if acc: steps.append(acc)
                            acc = [lab, d, br, br]
                    if acc: steps.append(acc)
                    dirs = directions(steps, stops[b]['name'], b + 1, stops[b]['address'])
            if pts is None:
                pts = [tuple(p) for p in chain]; m = cm; how = 'chain'
                dirs = 'Walk along the stroll’s route past the stops you’re leaving out, about %d m. You reach Stop %d, %s.' % (rnd(m), b + 1, stops[b]['name'])
            if straight < 250 and m > 2.5 * straight:
                pts = [A, B]; m = straight * 1.2; how = 'straight'
                dirs = 'Stop %d, %s, is about %d m %s.' % (b + 1, stops[b]['name'], rnd(m), compass(bearing(A, B)))
            pts = rdp([tuple(p) for p in pts], 3.0)
            m = int(round(m / 10.0) * 10)
            res['%d-%d' % (a, b)] = [m, mins(m), dirs, enc(pts)]
            report.append((sid, a, b, how, m, round(straight)))
    ALL[sid] = res
json.dump(ALL, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
from collections import Counter
print(Counter(r[3] for r in report)); print('bytes', os.path.getsize(OUT))
for r in report[:3]: print(r)
