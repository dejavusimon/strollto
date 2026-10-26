/* @ds-bundle: {"format":4,"namespace":"StrollTO","components":[{"name":"Button"},{"name":"IconButton"},{"name":"Icon"},{"name":"Badge"},{"name":"AppHeader"},{"name":"PhotoPlate"},{"name":"StopCard"},{"name":"ProgressIndicator"},{"name":"StampBadge"},{"name":"RouteMap"},{"name":"BottomSheet"},{"name":"WalkSpine"},{"name":"StrollMap"},{"name":"PassportBadge"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }
  function omit(obj, keys) {
    var o = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) < 0) o[k] = obj[k];
    return o;
  }

  /* ---------- Icon: placeholder 24px line set, 2px stroke ---------- */
  var PATHS = {
    pin: ['M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z', 'M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
    check: ['M5 12.5l4.5 4.5L19 7.5'],
    close: ['M6 6l12 12', 'M18 6L6 18'],
    back: ['M15 5l-7 7 7 7'],
    chevron: ['M9 6l6 6-6 6'],
    locate: ['M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M12 2v3', 'M12 19v3', 'M2 12h3', 'M19 12h3'],
    clock: ['M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M12 8v4l3 2'],
    route: ['M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M18 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M6 17v-6a3 3 0 0 1 3-3h1', 'M18 7v6a3 3 0 0 1-3 3h-1'],
    audio: ['M4 9.5h3.5L12 6v12l-4.5-3.5H4z', 'M15.5 9a4 4 0 0 1 0 6', 'M18 6.5a7.5 7.5 0 0 1 0 11'],
    play: ['M8 5.5v13l10.5-6.5z'],
    globe: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M3 12h18', 'M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3z'],
    star: ['M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z'],
    layers: ['M12 4l9 5-9 5-9-5z', 'M3 14l9 5 9-5'],
    stepfree: ['M9 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M9 8v6h6l2 5', 'M6.5 11.5A5 5 0 1 0 13 18'],
    heart: ['M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z'],
    'heart-filled': ['M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z'],
    food: ['M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z', 'M16 10h1.5a2.5 2.5 0 0 1 0 5H16', 'M8 3.5V6', 'M12 3.5V6'],
    shop: ['M5 8h14l-1 12H6z', 'M9 8V6a3 3 0 0 1 6 0v2'],
    landmark: ['M3 9l9-5 9 5', 'M5 9v9', 'M10 9v9', 'M14 9v9', 'M19 9v9', 'M3 20h18'],
    tree: ['M12 21v-6', 'M12 15a5 5 0 0 0 4.5-7.2A4.5 4.5 0 0 0 7.5 7.8 5 5 0 0 0 12 15z'],
    art: ['M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-1.8 0-.9-.6-1.3-.6-2.2 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 6.7 17 3 12 3z', 'M7.5 11.5h.01', 'M10 7.5h.01', 'M15 7.5h.01'],
    bench: ['M5 7h14', 'M4 12h16', 'M6 12v6', 'M18 12v6', 'M7 7v5', 'M17 7v5'],
    washroom: ['M12 3v18', 'M7 5.5h.01', 'M5 9h4v6H8v5H6v-5H5z', 'M17 5.5h.01', 'M17 9l2.5 7h-5z', 'M16 16v4', 'M18 16v4'],
    transit: ['M7 3h10a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2z', 'M5 10h14', 'M8.5 14h.01', 'M15.5 14h.01', 'M8 17l-2 4', 'M16 17l2 4'],
    alert: ['M12 4l9 16H3z', 'M12 10v4', 'M12 17h.01'],
    'wifi-off': ['M3 3l18 18', 'M8.5 16.5a5 5 0 0 1 7 0', 'M5 12.5a10 10 0 0 1 5-2.6', 'M19 12.5a10 10 0 0 0-2.4-1.7', 'M2 8.8a15 15 0 0 1 4.3-2.6', 'M22 8.8A15 15 0 0 0 11 5', 'M12 20h.01'],
    chat: ['M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-5 4v-4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z'],
    quote: ['M7 11h3v6H5v-5c0-3 1.5-5 4-6', 'M16 11h3v6h-5v-5c0-3 1.5-5 4-6'],
    info: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 11v6', 'M12 7.5h.01'],
    plus: ['M12 5v14', 'M5 12h14'],
    qr: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h2.5v2.5H14z', 'M17.5 17.5H20V20h-2.5z', 'M14 20h1', 'M20 14v1'],
    camera: ['M4 8h3.5l1.8-2.5h5.4L16.5 8H20v11H4z', 'M12 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
    video: ['M3.5 7h11v10h-11z', 'M14.5 10.5l6-3v9l-6-3'],
    phone: ['M7.5 2.5h9a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V4a1.5 1.5 0 0 1 1.5-1.5z', 'M10.5 18.5h3'],
    columns: ['M3.5 5h7v14h-7z', 'M13.5 5h7v14h-7z'],
    minus: ['M5 12h14'],
    share: ['M12 15V3.5', 'M7.5 8L12 3.5 16.5 8', 'M5 12.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6.5'],
    external: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
    hill: ['M3 19l6-9 4 5 3-4 5 8z'],
    coin: ['M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M14.5 9.5c-.5-1-1.4-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.9 2.5 2-1 2-2.5 2c-1.2 0-2.1-.5-2.6-1.5', 'M12 6.5V8', 'M12 16v1.5'],
    eye: ['M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
    pause: ['M8 5v14', 'M16 5v14'],
    flag: ['M5 21V4', 'M5 4h12l-2 4 2 4H5'],
    walk: ['M13.5 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M10 21l2-6 2.5 2.5V21', 'M8 12l1.5-4 3.5-.5 2 3.5 2.5 1', 'M12.5 15l-1-7'],
    'chevron-down': ['M6 9l6 6 6-6'],
    'chevron-up': ['M6 15l6-6 6 6'],
    'arrow-right': ['M5 12h14', 'M13 6l6 6-6 6']
  };
  var FILLED = { play: 1, 'heart-filled': 1 };
  function Icon(props) {
    var d = PATHS[props.name] || PATHS.pin;
    var fill = !!FILLED[props.name];
    return h('svg', {
      className: cx('st-icon', props.className), viewBox: '0 0 24 24', width: props.size || 20, height: props.size || 20,
      fill: fill ? 'currentColor' : 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
      'aria-hidden': props.label ? undefined : 'true', role: props.label ? 'img' : undefined, 'aria-label': props.label
    }, d.map(function (p, i) { return h('path', { key: i, d: p }); }));
  }

  /* ---------- Button ---------- */
  function Button(props) {
    var variant = props.variant || 'primary';
    var rest = omit(props, ['variant', 'size', 'fullWidth', 'icon', 'iconEnd', 'className', 'children']);
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('st-btn', 'st-btn-' + variant, props.size === 'sm' && 'st-btn-sm', props.fullWidth && 'st-btn-full', props.className)
    }), props.icon ? h(Icon, { name: props.icon }) : null, h('span', null, props.children), props.iconEnd ? h(Icon, { name: props.iconEnd }) : null);
  }

  /* ---------- IconButton ---------- */
  function IconButton(props) {
    var variant = props.variant || 'float';
    var rest = omit(props, ['variant', 'icon', 'label', 'className']);
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('st-iconbtn', 'st-iconbtn-' + variant, props.className), 'aria-label': props.label, title: props.label
    }), h(Icon, { name: props.icon }));
  }

  /* ---------- Badge ---------- */
  function Badge(props) {
    return h('span', { className: cx('st-badge', 'st-badge-' + (props.tone || 'neutral'), props.className) },
      props.icon ? h(Icon, { name: props.icon }) : null, props.children);
  }

  /* ---------- AppHeader ---------- */
  function AppHeader(props) {
    return h('header', { className: cx('st-header', props.className) },
      props.onBack ? h(IconButton, { icon: 'back', variant: 'on-primary', label: props.backLabel || 'Back', onClick: props.onBack }) : null,
      h('div', { className: 'st-header-text' },
        h('h1', { className: cx('st-header-title', props.brand && 'st-header-brand') }, props.title),
        props.subtitle ? h('p', { className: 'st-header-sub' }, props.subtitle) : null),
      props.actions || null);
  }

  /* ---------- PhotoPlate: stand-in for photography until real images exist ---------- */
  var SCENES = {
    market: [
      ['rect', { className: 'st-photo-far', x: 0, y: 58, width: 160, height: 40 }],
      ['polygon', { className: 'st-photo-near', points: '16,56 80,34 144,56' }],
      ['rect', { className: 'st-photo-mid', x: 16, y: 56, width: 128, height: 42 }],
      ['rect', { className: 'st-photo-sky', x: 28, y: 66, width: 10, height: 20, rx: 5 }],
      ['rect', { className: 'st-photo-sky', x: 50, y: 66, width: 10, height: 20, rx: 5 }],
      ['rect', { className: 'st-photo-sky', x: 72, y: 62, width: 16, height: 36, rx: 8 }],
      ['rect', { className: 'st-photo-sky', x: 100, y: 66, width: 10, height: 20, rx: 5 }],
      ['rect', { className: 'st-photo-sky', x: 122, y: 66, width: 10, height: 20, rx: 5 }]
    ],
    flatiron: [
      ['rect', { className: 'st-photo-far', x: 6, y: 44, width: 40, height: 54 }],
      ['rect', { className: 'st-photo-mid', x: 122, y: 54, width: 34, height: 44 }],
      ['polygon', { className: 'st-photo-near', points: '58,98 58,30 74,22 116,40 116,98' }],
      ['rect', { className: 'st-photo-sky', x: 64, y: 40, width: 4, height: 50 }],
      ['rect', { className: 'st-photo-sky', x: 82, y: 42, width: 4, height: 48 }],
      ['rect', { className: 'st-photo-sky', x: 98, y: 46, width: 4, height: 44 }]
    ],
    cathedral: [
      ['rect', { className: 'st-photo-mid', x: 24, y: 62, width: 112, height: 36 }],
      ['polygon', { className: 'st-photo-near', points: '80,8 90,40 70,40' }],
      ['rect', { className: 'st-photo-near', x: 68, y: 40, width: 24, height: 58 }],
      ['rect', { className: 'st-photo-sky', x: 76, y: 52, width: 8, height: 16, rx: 4 }],
      ['circle', { className: 'st-photo-green', cx: 26, cy: 88, r: 14 }],
      ['circle', { className: 'st-photo-green', cx: 138, cy: 86, r: 16 }]
    ],
    park: [
      ['rect', { className: 'st-photo-far', x: 0, y: 46, width: 52, height: 52 }],
      ['rect', { className: 'st-photo-mid', x: 112, y: 38, width: 48, height: 60 }],
      ['circle', { className: 'st-photo-green', cx: 46, cy: 74, r: 24 }],
      ['circle', { className: 'st-photo-green', cx: 98, cy: 70, r: 28 }],
      ['circle', { className: 'st-photo-green', cx: 140, cy: 82, r: 18 }],
      ['polygon', { className: 'st-photo-far', points: '70,120 90,120 84,98 76,98' }]
    ]
  };
  function PhotoPlate(props) {
    var scene = SCENES[props.scene] || SCENES.market;
    var kids = [
      h('rect', { key: 's', className: 'st-photo-sky', x: 0, y: 0, width: 160, height: 120 }),
    ].concat(scene.map(function (s, i) { return h(s[0], Object.assign({ key: i }, s[1])); }),
      [h('rect', { key: 'g', className: 'st-photo-ground', x: 0, y: 98, width: 160, height: 22 })]);
    var inner = props.src
      ? h('img', { src: props.src, alt: props.alt || '', style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } })
      : h('svg', { viewBox: '0 0 160 120', preserveAspectRatio: 'xMidYMid slice', role: 'img', 'aria-label': props.alt || 'Photo' }, kids);
    return h('div', { className: cx('st-photo', props.className) }, inner);
  }

  /* ---------- StopCard ---------- */
  function StopCard(props) {
    var layout = props.layout || 'stack';
    var status = props.status || 'upcoming';
    var badges = [];
    if (status === 'visited') badges.push(h(Badge, { key: 'v', tone: 'success', icon: 'check' }, props.visitedLabel || 'Visited'));
    if (status === 'current') badges.push(h(Badge, { key: 'c', tone: 'current', icon: 'pin' }, props.currentLabel || 'Next stop'));
    if (props.stamped) badges.push(h(Badge, { key: 's', tone: 'reward', icon: 'star' }, props.stampedLabel || 'Stamp collected'));
    if (props.stepFree) badges.push(h(Badge, { key: 'f', tone: 'primary', icon: 'stepfree' }, props.stepFreeLabel || 'Step-free'));
    var meta = [];
    if (props.area) meta.push(h('p', { key: 'a', className: 'st-stop-sub' }, props.area));
    if (props.walk) meta.push(h('p', { key: 'w', className: 'st-stop-sub st-stop-line' }, h(Icon, { name: 'clock' }), props.walk));
    return h('article', { className: cx('st-stop', layout === 'row' && 'st-stop-row', status === 'current' && 'is-current', props.className) },
      h('div', { className: 'st-stop-media' },
        h(PhotoPlate, { scene: props.scene, src: props.image, alt: props.imageAlt || props.title }),
        layout === 'stack' && props.number != null ? h('span', { className: 'st-stop-num' }, h(Badge, { tone: 'neutral' }, (props.stopLabel || 'Stop') + ' ' + props.number)) : null,
        layout === 'stack' && props.onListen ? h('span', { className: 'st-stop-action' }, h(IconButton, { icon: 'audio', label: props.listenLabel || 'Listen to this stop', onClick: props.onListen })) : null),
      h('div', { className: 'st-stop-meta' },
        h('h3', { className: 'st-stop-title' }, layout === 'row' && props.number != null ? props.number + '. ' + props.title : props.title),
        meta,
        badges.length ? h('div', { className: 'st-stop-badges' }, badges) : null));
  }

  /* ---------- ProgressIndicator ---------- */
  function ProgressIndicator(props) {
    var total = props.total || 1, visited = Math.min(props.visited || 0, total);
    var hasCurrent = props.current !== false && visited < total;
    var label = props.label || (visited + ' of ' + total + ' stops visited');
    var segs = [];
    for (var i = 0; i < total; i++) {
      segs.push(h('span', { key: i, className: cx('st-seg', i < visited && 'is-done', hasCurrent && i === visited && 'is-current') }));
    }
    return h('div', { className: cx('st-progress', props.className), role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': visited, 'aria-valuetext': label },
      h('div', { className: 'st-progress-head' },
        h('p', { className: 'st-progress-label' }, props.label ? props.label : [h('strong', { key: 'n' }, visited + ' of ' + total), ' stops visited']),
        props.distance ? h('p', { className: 'st-progress-dist' }, props.distance) : null),
      h('div', { className: 'st-progress-track', 'aria-hidden': 'true' }, segs));
  }

  /* ---------- StampBadge ---------- */
  function StampBadge(props) {
    var earned = props.earned !== false;
    var px = props.size === 'lg' ? 128 : 72;
    var star = 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z';
    var status = earned ? (props.earnedText || 'stamp collected') : (props.lockedText || 'not collected yet');
    return h('div', { className: cx('st-stamp', !earned && 'is-locked', props.size === 'lg' && 'st-stamp-lg', props.className) },
      h('svg', { viewBox: '0 0 72 72', width: px, height: px, role: 'img', 'aria-label': props.label + ': ' + status },
        h('circle', { className: 'st-stamp-fill', cx: 36, cy: 36, r: 33 }),
        h('circle', { className: 'st-stamp-ring', cx: 36, cy: 36, r: 33 }),
        h('circle', { className: 'st-stamp-inner', cx: 36, cy: 36, r: 26.5 }),
        h('path', { className: 'st-stamp-glyph', d: star, transform: 'translate(20 19) scale(1.333)' })),
      h('p', { className: 'st-stamp-label' }, props.label),
      props.date || !earned ? h('p', { className: 'st-stamp-date' }, earned ? props.date : (props.lockedHint || 'Not yet')) : null);
  }

  /* ---------- RouteMap ---------- */
  var DEMO_STOPS = [
    { x: 60, y: 132, status: 'visited', name: 'St. James Cathedral' },
    { x: 124, y: 200, status: 'visited', name: 'Gooderham Building' },
    { x: 246, y: 206, status: 'current', name: 'St. Lawrence Market' },
    { x: 306, y: 132, status: 'upcoming', name: 'St. Lawrence Hall' },
    { x: 200, y: 86, status: 'upcoming', name: 'Toronto’s First Post Office' },
    { x: 104, y: 86, status: 'upcoming', name: 'Berczy Park' }
  ];
  var DEMO_LEGS = [
    [[60, 132], [124, 132], [124, 200]],
    [[124, 200], [124, 206], [246, 206]],
    [[246, 206], [306, 206], [306, 132]],
    [[306, 132], [306, 86], [200, 86]],
    [[200, 86], [104, 86]]
  ];
  var DEMO_WATER = 'M0 560 C 90 545 200 575 360 552 V640 H0 Z';
  var DEMO_PARKS = [[138, 96, 52, 26], [140, 146, 64, 38]];
  var DEMO_STREETS = [[0, 86, 360, 86, 8], [0, 132, 360, 132, 10], [0, 206, 360, 206, 10], [0, 290, 360, 290, 8], [0, 500, 360, 500, 14], [40, 0, 40, 640, 10], [124, 0, 124, 640, 8], [306, 0, 306, 640, 8], [200, 206, 200, 640, 6]];
  var DEMO_LABELS = [[214, 124, 'King St E'], [140, 230, 'Front St E']];
  function pts(a) { return a.map(function (p) { return p[0] + ',' + p[1]; }).join(' '); }
  function RouteMap(props) {
    var stops = props.stops || DEMO_STOPS, legs = props.legs || DEMO_LEGS, me = props.me === undefined ? [190, 206] : props.me;
    var water = props.water !== undefined ? props.water : DEMO_WATER;
    var parks = props.parks || DEMO_PARKS, streets = props.streets || DEMO_STREETS, labels = props.labels || DEMO_LABELS;
    var kids = [];
    if (water) kids.push(h('path', { key: 'w', className: 'st-map-water', d: water }));
    parks.forEach(function (p, i) { kids.push(h('rect', { key: 'p' + i, className: 'st-map-park', x: p[0], y: p[1], width: p[2], height: p[3], rx: 4 })); });
    streets.forEach(function (r, i) {
      kids.push(h('line', { key: 'r' + i, className: 'st-map-road', x1: r[0], y1: r[1], x2: r[2], y2: r[3], strokeWidth: r[4] || 8 }));
    });
    /* Getting there: the walk from a station to Stop 1, and the station itself. */
    (props.access || []).forEach(function (t, i) { kids.push(h('polyline', { key: 'x' + i, className: 'st-map-walk', points: pts(t) })); });
    labels.forEach(function (t, i) { kids.push(h('text', { key: 't' + i, className: 'st-map-street', x: t[0], y: t[1] }, t[2])); });
    (props.stations || []).forEach(function (s, i) {
      kids.push(h('g', { key: 'st' + i, role: 'img', 'aria-label': s.name || 'Station' },
        h('rect', { className: 'st-map-station', x: s.x - 9, y: s.y - 9, width: 18, height: 18, rx: 4 }),
        h('path', { className: 'st-map-station-glyph', d: 'M' + (s.x - 4) + ' ' + (s.y - 4) + 'h8v6h-8z M' + (s.x - 3) + ' ' + (s.y + 5) + 'l-1.5 2.5 M' + (s.x + 3) + ' ' + (s.y + 5) + 'l1.5 2.5' })));
    });
    var activeLeg = props.activeLeg;
    legs.forEach(function (leg, i) {
      var to = stops[i + 1] ? stops[i + 1].status : 'upcoming';
      /* legStates (optional): one of 'done' | 'active' | 'ahead' per leg, used when a plan skips stops and legs no longer join neighbours. */
      var ls = props.legStates && props.legStates[i];
      var cls = ls ? 'st-map-' + ls : activeLeg != null
        ? (i < activeLeg ? 'st-map-done' : i === activeLeg ? 'st-map-active' : 'st-map-ahead')
        : (to === 'visited' ? 'st-map-done' : to === 'current' ? 'st-map-active' : 'st-map-ahead');
      kids.push(h('polyline', { key: 'l' + i, className: cls, points: pts(leg) }));
    });
    (props.cautions || []).forEach(function (c, i) {
      kids.push(h('g', { key: 'c' + i, role: 'img', 'aria-label': c[2] || 'Caution on this part of the route' },
        h('circle', { className: 'st-map-caution', cx: c[0], cy: c[1], r: 12 }),
        h('path', { className: 'st-map-caution-glyph', d: 'M' + c[0] + ' ' + (c[1] - 6) + 'l6 10.5h-12z' }),
        h('path', { className: 'st-map-caution-mark', d: 'M' + c[0] + ' ' + (c[1] - 2) + 'v3' })));
    });
    if (me) {
      kids.push(h('circle', { key: 'mh', className: 'st-me-halo', cx: me[0], cy: me[1], r: 18 }));
      kids.push(h('circle', { key: 'm', className: 'st-me', cx: me[0], cy: me[1], r: 8 }));
    }
    stops.forEach(function (s, i) {
      var st = s.status || 'upcoming';
      var label = 'Stop ' + (i + 1) + ', ' + s.name + ', ' + (st === 'visited' ? 'visited' : st === 'skipped' ? 'skipped' : st === 'here' ? 'you are here' : (st === 'current' || st === 'next') ? 'next stop' : 'coming up');
      var act = props.onStop ? function () { props.onStop(i); } : null;
      kids.push(h('g', act
        ? { key: 's' + i, role: 'button', tabIndex: 0, 'aria-label': label, onClick: act, onKeyDown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } } }
        : { key: 's' + i, role: 'img', 'aria-label': label },
        act ? h('circle', { className: 'st-pin-hit', cx: s.x, cy: s.y, r: 22 }) : null,
        h('circle', { className: 'st-pin is-' + (st === 'visited' ? 'done' : st), cx: s.x, cy: s.y, r: (st === 'current' || st === 'next') ? 17 : st === 'skipped' ? 12 : 14 }),
        st === 'visited'
          ? h('path', { className: 'st-pin-check', d: 'M' + (s.x - 6) + ' ' + s.y + 'l4 4 8-8' })
          : h('text', { className: cx('st-pin-num', (st === 'current' || st === 'here') && 'on-fill', st === 'next' && 'on-next', st === 'skipped' && 'is-skipped'), x: s.x, y: s.y + 1 }, String(i + 1))));
    });
    return h('div', { className: cx('st-map', props.className) },
      h('svg', { viewBox: '0 0 360 640', preserveAspectRatio: 'xMidYMin slice', role: 'group', 'aria-label': props.label || 'Walking route map' }, kids));
  }


  /* ---------- WalkSpine: the stroll drawn as walking time ---------- */
  function WalkSpine(props) {
    var legs = props.legs || [];
    var n = legs.length + 1;
    var compact = props.size === 'compact';
    var W = props.width || 343, pad = 10, inner = W - pad * 2;
    var H = compact ? 32 : 48, yLab = compact ? 10 : 13, yLine = compact ? 17 : 24, yNum = compact ? 31 : 43;
    var w = legs.map(function (l) { return l.metres != null ? l.metres : (l.minutes || 0); });
    var total = w.reduce(function (a, b) { return a + b; }, 0) || 1;
    var xs = [pad], acc = 0;
    w.forEach(function (v) { acc += v; xs.push(pad + inner * acc / total); });
    var here = props.current != null ? props.current : null;
    var li = -1;
    legs.forEach(function (l, i) { if (li < 0 || w[i] > w[li]) li = i; });
    var kids = [];
    legs.forEach(function (l, i) {
      kids.push(h('line', { key: 'l' + i, className: cx('st-spine-line', here != null && i < here && 'is-done', i === li && 'is-longest'),
        x1: xs[i], y1: yLine, x2: xs[i + 1], y2: yLine }));
    });
    xs.forEach(function (x, i) {
      if (i === here) return;
      kids.push(h('circle', { key: 'c' + i, className: cx('st-spine-tick', here != null && i < here && 'is-done'), cx: x, cy: yLine, r: compact ? 3 : 3.5 }));
    });
    if (here != null && xs[here] != null) {
      kids.push(h('circle', { key: 'here', className: 'st-spine-here', cx: xs[here], cy: yLine, r: compact ? 6 : 7 }));
    }
    /* Stops closer than one label width share a range label ("3-8") instead of overlapping. */
    var MIN = props.minGap || 18, groups = [];
    xs.forEach(function (x, i) {
      var g = groups[groups.length - 1];
      if (g && x - xs[g.last] < MIN) g.last = i; else groups.push({ first: i, last: i });
    });
    groups.forEach(function (g, k) {
      var mid = (xs[g.first] + xs[g.last]) / 2;
      /* labels (optional): the stop number shown under each tick, e.g. when a plan skips stops. */
      var lab = function (i) { return props.labels && props.labels[i] != null ? String(props.labels[i]) : String(i + 1); };
      var txt = g.first === g.last ? lab(g.first) : lab(g.first) + '\u2013' + lab(g.last);
      var isHere = here != null && here >= g.first && here <= g.last;
      kids.push(h('text', { key: 'n' + k, className: cx('st-spine-num', isHere && 'is-here'), x: Math.max(6, Math.min(W - 6, mid)), y: yNum }, txt));
    });
    if (li >= 0) {
      var lt = props.longestLabel || ('longest stretch: ' + (legs[li].minutes != null ? legs[li].minutes + ' min' : ''));
      var tw = lt.length * 6.4, mx = (xs[li] + xs[li + 1]) / 2;
      kids.push(h('text', { key: 'lt', className: 'st-spine-long', x: Math.max(tw / 2 + 2, Math.min(W - tw / 2 - 2, mx)), y: yLab }, lt));
    }
    return h('svg', { className: cx('st-spine', compact && 'st-spine-compact', props.className), viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': props.label || ('Walking-time outline of ' + n + ' stops') }, kids);
  }


  /* ---------- StrollMap: Toronto, its transit, and every stroll ---------- */
  /* Everything is projected to screen pixels on each render, so pins, labels and
     strokes keep the same size at every zoom. The map is a picture for sighted
     users; the page must offer the same strolls, stops and stations as a list. */
  var MKX = Math.cos(43.7 * Math.PI / 180) * 111320, MKY = 111320;
  function mapPath(pts, P) { var s = ''; for (var i = 0; i < pts.length; i++) { var q = P(pts[i][0], pts[i][1]); s += (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); } return s; }
  function glyph(name, x, y, size, cls) {
    var d = PATHS[name] || PATHS.pin, k = size / 24;
    return h('g', { transform: 'translate(' + (x - size / 2) + ' ' + (y - size / 2) + ') scale(' + k + ')', className: cls }, d.map(function (p, i) { return h('path', { key: i, d: p }); }));
  }
  function StrollMap(props) {
    var W = props.width || 375, H = props.height || 600;
    var f = props.focus || { lat: 43.705, lon: -79.385, mpp: 115, key: 'init' };
    var vs = React.useState({ lat: f.lat, lon: f.lon, mpp: f.mpp }), view = vs[0], setView = vs[1];
    var drag = React.useRef(null), moved = React.useRef(false);
    React.useEffect(function () { setView({ lat: f.lat, lon: f.lon, mpp: f.mpp }); }, [f.key]);
    var P = function (lat, lon) { return [W / 2 + (lon - view.lon) * MKX / view.mpp, H / 2 - (lat - view.lat) * MKY / view.mpp]; };
    var inView = function (q, m) { m = m || 30; return q[0] > -m && q[0] < W + m && q[1] > -m && q[1] < H + m; };
    var zoom = function (k, at) {
      setView(function (v) {
        var mpp = Math.max(1.2, Math.min(160, v.mpp / k));
        if (!at) return { lat: v.lat, lon: v.lon, mpp: mpp };
        return { lat: at[0], lon: at[1], mpp: mpp };
      });
    };
    var base = props.base || {}, kids = [];
    // water: the lake south of the shoreline, then the islands and the spit back on top as land
    var S = base.shore || [];
    if (S.length) {
      var ring = [[S[0][0], S[0][1] - 1]].concat(S, [[S[S.length - 1][0] + 0.2, S[S.length - 1][1] + 1], [42.9, S[S.length - 1][1] + 1], [42.9, S[0][1] - 1]]);
      kids.push(h('path', { key: 'lake', className: 'st-cmap-water', d: mapPath(ring, P) + 'Z' }));
      [base.islands, base.spit].forEach(function (poly, i) { if (poly) kids.push(h('path', { key: 'isl' + i, className: 'st-cmap-land', d: mapPath(poly, P) + 'Z' })); });
    }
    var showMinor = view.mpp <= 30;
    (base.streets || []).forEach(function (st, i) {
      if (!st.major && !showMinor) return;
      st.parts.forEach(function (pt, j) { kids.push(h('path', { key: 's' + i + '-' + j, className: cx('st-cmap-street', st.major && 'is-major'), d: mapPath(pt, P) })); });
    });
    if (props.showTransit !== false) {
      (base.cars || []).forEach(function (c, i) { c.parts.forEach(function (pt, j) { kids.push(h('path', { key: 'c' + i + '-' + j, className: 'st-cmap-car', d: mapPath(pt, P) })); }); });
      (base.lines || []).forEach(function (l, i) {
        kids.push(h('path', { key: 'l' + i, className: 'st-cmap-line', style: { stroke: l.color }, d: mapPath(l.stops.map(function (s) { return [s[1], s[2]]; }), P) }));
      });
    }
    // stations: always shown when transit is on, larger and tappable when picking a station
    var pick = !!props.pickStation, seen = {};
    if (props.showTransit !== false || pick) {
      (base.lines || []).forEach(function (l) {
        l.stops.forEach(function (s) {
          if (seen[s[0]]) return; seen[s[0]] = 1;
          var q = P(s[1], s[2]); if (!inView(q)) return;
          var on = props.station && props.station.name === s[0];
          var r = on ? 8 : pick ? 6 : (view.mpp > 30 ? 2.6 : 4);
          kids.push(h('g', { key: 'st' + s[0], onClick: pick && props.onStation ? function () { if (!moved.current) props.onStation(s[0]); } : undefined, style: pick ? { cursor: 'pointer' } : undefined },
            pick ? h('circle', { className: 'st-cmap-hit', cx: q[0], cy: q[1], r: 22 }) : null,
            h('circle', { className: cx('st-cmap-station', on && 'is-on'), cx: q[0], cy: q[1], r: r })));
          if (on || (view.mpp <= 7 && !pick)) kids.push(h('text', { key: 'stl' + s[0], className: cx('st-cmap-stlabel', on && 'is-on'), x: q[0] + (on ? 12 : 7), y: q[1] - (on ? 10 : 6) }, s[0]));
        });
      });
    }
    // walking links from the chosen station to each stroll it reaches
    if (props.station && props.reachIds) {
      var sp = P(props.station.lat, props.station.lon);
      (props.strolls || []).forEach(function (r) {
        if (props.reachIds.indexOf(r.id) < 0) return;
        var q = P(r.lat, r.lon);
        kids.push(h('line', { key: 'rl' + r.id, className: 'st-cmap-reach', x1: sp[0], y1: sp[1], x2: q[0], y2: q[1] }));
      });
    }
    var level = view.mpp > 45 ? 'cluster' : view.mpp > 4 ? 'pin' : 'stop';
    var sel = props.selectedId, strolls = props.strolls || [];
    var click = function (fn) { return function (e) { if (moved.current) return; if (e) e.stopPropagation(); fn(); }; };
    var faded = function (r) { return (props.reachIds && props.reachIds.indexOf(r.id) < 0) || (sel && r.id !== sel); };
    var drawPin = function (r, q) {
      var big = !!r.pilot, rr = big ? 15 : 11;
      var g = [h('circle', { key: 'h', className: 'st-cmap-hit', cx: q[0], cy: q[1], r: 22 }),
        h('circle', { key: 'c', className: cx('st-cmap-pin', big && 'is-pilot', r.id === sel && 'is-sel'), cx: q[0], cy: q[1], r: rr }),
        h('text', { key: 't', className: cx('st-cmap-pinnum', big && 'is-pilot'), x: q[0], y: q[1] + 0.5 }, String(r.count))];
      if (r.far) g.push(h('g', { key: 'far' }, h('circle', { className: 'st-cmap-far', cx: q[0] + rr - 2, cy: q[1] + rr - 2, r: 7 }), h('path', { className: 'st-cmap-farmark', d: 'M' + (q[0] + rr - 6) + ' ' + (q[1] + rr - 6) + 'l8 8' })));
      if (big && r.tag) {
        var tw = r.tag.length * 6.3 + 14;
        g.push(h('g', { key: 'tag' }, h('rect', { className: 'st-cmap-tag', x: q[0] + rr + 4, y: q[1] - 10, width: tw, height: 20, rx: 10 }),
          h('text', { className: 'st-cmap-tagtext', x: q[0] + rr + 4 + tw / 2, y: q[1] + 0.5 }, r.tag)));
      }
      return h('g', { key: 'p' + r.id, opacity: faded(r) ? 0.3 : 1, onClick: click(function () { props.onSelect && props.onSelect(r.id); }), style: { cursor: 'pointer' } }, g);
    };
    var pilots = [], others = [];
    strolls.forEach(function (r) { if (r.id === sel) return; (r.pilot ? pilots : others).push(r); });
    if (level === 'cluster') {
      var cell = 64 * view.mpp, buckets = {};
      others.forEach(function (r) {
        var k = Math.floor(r.lon * MKX / cell) + ':' + Math.floor(r.lat * MKY / cell);
        (buckets[k] = buckets[k] || []).push(r);
      });
      Object.keys(buckets).forEach(function (k) {
        var b = buckets[k];
        var lat = 0, lon = 0; b.forEach(function (r) { lat += r.lat; lon += r.lon; }); lat /= b.length; lon /= b.length;
        var q = P(lat, lon); if (!inView(q)) return;
        if (b.length === 1) { kids.push(drawPin(b[0], q)); return; }
        var fade = b.every(faded);
        kids.push(h('g', { key: 'k' + k, opacity: fade ? 0.3 : 1, onClick: click(function () { zoom(2.6, [lat, lon]); }), style: { cursor: 'pointer' } },
          h('circle', { className: 'st-cmap-hit', cx: q[0], cy: q[1], r: 22 }),
          h('circle', { className: 'st-cmap-cluster', cx: q[0], cy: q[1], r: b.length > 9 ? 18 : 15 }),
          h('text', { className: 'st-cmap-clnum', x: q[0], y: q[1] + 0.5 }, String(b.length))));
      });
    } else {
      others.forEach(function (r) {
        if (level === 'stop' && !sel && r.stops && r.stops.length) {
          var any = false;
          r.stops.forEach(function (s, i) {
            var q = P(s[0], s[1]); if (!inView(q)) return; any = true;
            kids.push(h('g', { key: 'ms' + r.id + i, opacity: faded(r) ? 0.3 : 1, onClick: click(function () { props.onSelect && props.onSelect(r.id); }), style: { cursor: 'pointer' } },
              h('circle', { className: 'st-cmap-hit', cx: q[0], cy: q[1], r: 16 }),
              h('circle', { className: 'st-cmap-mini', cx: q[0], cy: q[1], r: 9 }),
              h('text', { className: 'st-cmap-mininum', x: q[0], y: q[1] + 0.5 }, String(i + 1))));
          });
          return;
        }
        var q = P(r.lat, r.lon); if (inView(q)) kids.push(drawPin(r, q));
      });
    }
    pilots.forEach(function (r) { var q = P(r.lat, r.lon); if (inView(q, 120)) kids.push(drawPin(r, q)); });
    // the chosen stroll: its route in walking order, numbered stops with category icons
    var chosen = sel ? strolls.filter(function (r) { return r.id === sel; })[0] : null;
    if (chosen) {
      if (chosen.stops && chosen.stops.length > 1) {
        kids.push(h('path', { key: 'route', className: 'st-cmap-route', d: mapPath(chosen.stops, P) }));
        chosen.stops.forEach(function (s, i) {
          var q = P(s[0], s[1]), on = props.activeStop === i;
          kids.push(h('g', { key: 'cs' + i, onClick: click(function () { props.onStop && props.onStop(i); }), style: { cursor: 'pointer' } },
            h('circle', { className: 'st-cmap-hit', cx: q[0], cy: q[1], r: 20 }),
            h('circle', { className: cx('st-cmap-stop', on && 'is-on'), cx: q[0], cy: q[1], r: on ? 15 : 13 }),
            h('text', { className: 'st-cmap-stopnum', x: q[0], y: q[1] + 0.5 }, String(i + 1)),
            s[2] ? h('g', null, h('circle', { className: 'st-cmap-cat', cx: q[0] + 12, cy: q[1] - 12, r: 8.5 }), glyph(s[2], q[0] + 12, q[1] - 12, 12, 'st-cmap-catglyph')) : null));
        });
      } else {
        kids.push(drawPin(chosen, P(chosen.lat, chosen.lon)));
      }
    }
    if (props.me) {
      var mq = P(props.me.lat, props.me.lon);
      kids.push(h('circle', { key: 'mh', className: 'st-me-halo', cx: mq[0], cy: mq[1], r: 18 }));
      kids.push(h('circle', { key: 'm', className: 'st-me', cx: mq[0], cy: mq[1], r: 8 }));
    }
    var onDown = function (e) { drag.current = { x: e.clientX, y: e.clientY, lat: view.lat, lon: view.lon }; moved.current = false; };
    var onMove = function (e) {
      var d = drag.current; if (!d) return;
      var dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (!moved.current && Math.abs(dx) + Math.abs(dy) < 6) return;
      moved.current = true;
      setView({ lat: d.lat + dy * view.mpp / MKY, lon: d.lon - dx * view.mpp / MKX, mpp: view.mpp });
    };
    var onUp = function () { drag.current = null; setTimeout(function () { moved.current = false; }, 0); };
    return h('div', { className: cx('st-cmap', props.className), style: { height: H }, role: 'region', 'aria-label': props.label || 'Map of Toronto strolls' },
      h('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true', onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerLeave: onUp,
        onWheel: function (e) { zoom(e.deltaY < 0 ? 1.25 : 0.8); } }, kids),
      h('div', { className: 'st-cmap-zoom', style: props.controlsTop != null ? { top: props.controlsTop } : undefined },
        h('button', { type: 'button', className: 'st-iconbtn st-iconbtn-float', 'aria-label': props.zoomInLabel || 'Zoom in', onClick: function () { zoom(1.8); } }, h(Icon, { name: 'plus' })),
        h('button', { type: 'button', className: 'st-iconbtn st-iconbtn-float', 'aria-label': props.zoomOutLabel || 'Zoom out', onClick: function () { zoom(1 / 1.8); } }, h(Icon, { name: 'minus' }))));
  }


  /* ---------- PassportBadge: a stroll's badge, one piece per stamp post ---------- */
  function PassportBadge(props) {
    var n = Math.max(1, props.total || 4), got = props.collected || [];
    var px = props.size === 'lg' ? 176 : props.size === 'sm' ? 72 : 120;
    var C = 50, R = 45, kids = [], done = got.length >= n;
    var pt = function (a, r) { var t = a * Math.PI / 180; return [C + r * Math.cos(t), C + r * Math.sin(t)]; };
    for (var i = 0; i < n; i++) {
      var a0 = -90 + i * 360 / n, a1 = a0 + 360 / n, on = got.indexOf(i) >= 0;
      var s0 = pt(a0, R), s1 = pt(a1, R);
      var d = n === 1 ? 'M' + (C - R) + ' ' + C + 'a' + R + ' ' + R + ' 0 1 0 ' + 2 * R + ' 0a' + R + ' ' + R + ' 0 1 0 ' + (-2 * R) + ' 0Z'
        : 'M' + C + ' ' + C + 'L' + s0[0].toFixed(2) + ' ' + s0[1].toFixed(2) + 'A' + R + ' ' + R + ' 0 ' + (360 / n > 180 ? 1 : 0) + ' 1 ' + s1[0].toFixed(2) + ' ' + s1[1].toFixed(2) + 'Z';
      kids.push(h('path', { key: 'w' + i, className: cx('st-pp-piece', on && 'is-on'), d: d }));
      var m = pt((a0 + a1) / 2, 29);
      kids.push(on ? h('g', { key: 'c' + i }, glyph('check', m[0], m[1], 14, 'st-pp-glyph')) : h('text', { key: 'n' + i, className: 'st-pp-num', x: m[0], y: m[1] }, String(i + 1)));
    }
    kids.push(h('circle', { key: 'hub', className: cx('st-pp-hub', done && 'is-done'), cx: C, cy: C, r: 13 }));
    if (done) kids.push(h('g', { key: 'star' }, glyph('star', C, C, 16, 'st-pp-star')));
    var status = props.statusText || (got.length + ' of ' + n + ' pieces collected');
    return h('div', { className: cx('st-pp', props.className) },
      h('svg', { viewBox: '0 0 100 100', width: px, height: px, role: 'img', 'aria-label': (props.label || 'Badge') + ': ' + status }, kids),
      props.label && props.showLabel !== false ? h('p', { className: 'st-pp-label' }, props.label) : null,
      props.showStatus !== false ? h('p', { className: 'st-pp-status' }, status) : null);
  }

  /* ---------- BottomSheet ---------- */
  function BottomSheet(props) {
    return h('section', { className: cx('st-sheet', props.className), 'aria-label': props.label || props.title, style: props.height ? { height: props.height } : undefined },
      props.floating ? h('div', { className: 'st-sheet-float' }, props.floating) : null,
      h('button', { type: 'button', className: 'st-sheet-handle', 'aria-label': props.handleLabel || 'Show more', 'aria-expanded': props.expanded ? 'true' : 'false', onClick: props.onToggle },
        h('span', { 'aria-hidden': 'true' })),
      h('div', { className: 'st-sheet-body' },
        props.eyebrow || props.title ? h('div', null,
          props.eyebrow ? h('p', { className: 'st-sheet-eyebrow' }, props.eyebrow) : null,
          props.title ? h('h2', { className: 'st-sheet-title' }, props.title) : null) : null,
        props.children));
  }

  var api = { Button: Button, IconButton: IconButton, Icon: Icon, Badge: Badge, AppHeader: AppHeader, PhotoPlate: PhotoPlate, StopCard: StopCard, ProgressIndicator: ProgressIndicator, StampBadge: StampBadge, RouteMap: RouteMap, BottomSheet: BottomSheet, WalkSpine: WalkSpine, StrollMap: StrollMap, PassportBadge: PassportBadge };
  window.StrollTO = Object.assign(window.StrollTO || {}, api);
})();
