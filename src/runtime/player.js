// Renders the Claude Design prototype (template + logic from src/generated/prototype.js) with React 18
// and the StrollTO design system (src/ds/bundle.js, which registers window.StrollTO).
//
// Template vocabulary (same as Claude Design):
//   {{a.b}}                                    value holes in text and attributes
//   <sc-if value="{{x}}">                       render children when x is truthy
//   <sc-for list="{{xs}}" as="x">               repeat children for each item
//   <x-import component-from-global-scope="StrollTO.Button" on-click="{{f}}">   design-system component
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AST, createPrototype } from '../generated/prototype.js';

const h = React.createElement;
const DS = () => window.StrollTO;

// ---------- template -> React ----------
function look(scope, p) {
  var ps = p.split('.'), v, found = false;
  if (ps[0] === 'true') return true;
  if (ps[0] === 'false') return false;
  for (var i = 0; i < scope.length; i++) { var sc = scope[i]; if (sc && Object.prototype.hasOwnProperty.call(sc, ps[0])) { v = sc[ps[0]]; found = true; break; } }
  if (!found) return undefined;
  for (var j = 1; j < ps.length; j++) v = v == null ? v : v[ps[j]];
  return v;
}
var WHOLE = /^\{\{([^}]+)\}\}$/;
function val(str, scope) { var m = WHOLE.exec(str || ''); return m ? look(scope, m[1].trim()) : interp(str, scope); }
function interp(str, scope) { return String(str == null ? '' : str).replace(/\{\{([^}]+)\}\}/g, function (_, k) { var v = look(scope, k.trim()); return v == null ? '' : String(v); }); }
function camel(k) { return k.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); }); }
function styleObj(s) {
  var o = {};
  String(s || '').split(';').forEach(function (d) {
    var i = d.indexOf(':'); if (i < 0) return;
    var k = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); if (!k) return;
    o[k.indexOf('--') === 0 ? k : camel(k)] = v;
  });
  return o;
}
var ATTR = { 'class': 'className', 'for': 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', autocomplete: 'autoComplete', autocapitalize: 'autoCapitalize',
  inputmode: 'inputMode', spellcheck: 'spellCheck', maxlength: 'maxLength', colspan: 'colSpan', rowspan: 'rowSpan', enterkeyhint: 'enterKeyHint', crossorigin: 'crossOrigin', srcset: 'srcSet' };
var EVENTS = { onClick: 'onClick', onInput: 'onChange', onChange: 'onChange', onSubmit: 'onSubmit', onKeyDown: 'onKeyDown', onFocus: 'onFocus', onBlur: 'onBlur', onScroll: 'onScroll', onPointerDown: 'onPointerDown', onPointerUp: 'onPointerUp' };
var BOOL = { hidden: 1, disabled: 1, checked: 1, multiple: 1, required: 1, open: 1, readOnly: 1, autoFocus: 1, download: 0 };

function flat(kids, out) { (kids || []).forEach(function (k) { if (Array.isArray(k)) flat(k, out); else if (k && k.type === React.Fragment) flat([].concat(k.props.children), out); else out.push(k); }); return out; }

function walk(nodes, scope, key) {
  var out = [];
  for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i], k = key + '.' + i;
    if (typeof n === 'string') { out.push(interp(n, scope)); continue; }
    var tag = n[0], a = n[1], kids = n[2];
    if (tag === 'sc-if') { if (val(a.value, scope)) out.push(h(React.Fragment, { key: k }, walk(kids, scope, k))); continue; }
    if (tag === 'sc-for') {
      var list = val(a.list, scope) || [];
      for (var j = 0; j < list.length; j++) { var it = {}; it[a.as] = list[j]; out.push(h(React.Fragment, { key: k + ':' + j }, walk(kids, [it].concat(scope), k + ':' + j))); }
      continue;
    }
    if (tag === 'x-import') {
      var name = String(a['component-from-global-scope']).split('.')[1], C = DS()[name];
      var props = { key: k };
      for (var ak in a) { if (ak === 'component-from-global-scope') continue; props[camel(ak)] = val(a[ak], scope); }
      if (props.className == null && props['class'] != null) props.className = props['class'];
      var ch = walk(kids, scope, k);
      if (ch.length) props.children = ch.length === 1 ? ch[0] : ch;
      out.push(C ? h(C, props) : h('b', { key: k, style: { color: 'red' } }, '[' + name + ' missing]'));
      continue;
    }
    var p = { key: k }, selectedVal;
    for (var at in a) {
      var raw = a[at];
      if (at === 'ref') { var rf = val(raw, scope); if (typeof rf === 'function') p.ref = rf; continue; }
      if (EVENTS[at]) { var fn = val(raw, scope); if (typeof fn === 'function') p[EVENTS[at]] = fn; continue; }
      if (/^hint-/.test(at)) continue;
      var v = val(raw, scope);
      if (at === 'style') { p.style = styleObj(v); continue; }
      if (at === 'selected' && tag === 'option') { if (v === true || v === 'true') p['data-sel'] = '1'; continue; }
      var nm = ATTR[at] || at;
      if (v === false || v == null) continue;
      if (BOOL[nm]) { if (v === 'false') continue; p[nm] = true; continue; }
      if (nm === 'value' && (tag === 'input' || tag === 'textarea')) { p.value = String(v); if (!p.onChange && !a.onInput && !a.onChange) p.readOnly = true; continue; }
      p[nm] = v === true ? '' : v;
    }
    if ((tag === 'input' || tag === 'textarea') && p.value != null && !p.onChange && !p.readOnly) p.onChange = function () {};
    var children = walk(kids, scope, k);
    if (tag === 'select') {
      flat(children, []).forEach(function (o) { if (o && o.props && o.props['data-sel'] === '1') selectedVal = o.props.value; });
      if (selectedVal != null) p.value = selectedVal; else p.value = '';
      if (!p.onChange) p.onChange = function () {};
    }
    out.push(children.length ? h(tag, p, children) : h(tag, p));
  }
  return out;
}


// ---------- logic host ----------
function makeDCLogic() {
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch, cb) {
    if (typeof patch === 'function') patch = patch(this.state, this.props);
    this.state = Object.assign({}, this.state, patch || {});
    if (this.__host) this.__host.forceUpdate(cb); else if (cb) cb();
  };
  return DCLogic;
}

// Photos the team hasn't cleared yet (Street View captures, third-party photos, photos without a credit).
const BLOCKED = /^(Google Street View|credit to be confirmed|TorontoJourney416)/;
function hideUnclearedPhotos(M) {
  const blocked = {};
  M.STROLLS.forEach((s) => s.stops.forEach((t) => {
    const keep = (t.photos || []).filter((ph) => { if (BLOCKED.test(ph.credit || '')) { blocked[ph.src] = 1; return false; } return true; });
    if ((t.photos || []).length && !keep.length) { t.photos = []; t.photoSoon = true; } else t.photos = keep;
  }));
  const clear = (r) => { if (r.cover && blocked[r.cover]) { r.cover = ''; r.coverAlt = 'Drawing standing in for a photo of the ' + r.place + ' stroll'; } };
  M.STROLLS.forEach(clear); (M.MAP_STROLLS || []).forEach(clear);
  if (M.BOARD) Object.keys(M.BOARD).forEach((k) => M.BOARD[k].forEach((post) => { if (post.photo && blocked[post.photo.src]) delete post.photo; }));
}

class Host extends React.Component {
  constructor(props) {
    super(props);
    this.logic = new props.M.Component(props.appProps);
    this.logic.__host = this;
    if (props.onReady) props.onReady(this);
  }
  componentDidMount() { if (this.logic.componentDidMount) this.logic.componentDidMount(); }
  setProps(patch) { Object.assign(this.logic.props, patch); this.forceUpdate(); }
  render() {
    let vals;
    try { vals = this.logic.renderVals(); } catch (e) { console.error(e); return h('pre', { style: { color: 'red', padding: 16 } }, 'Prototype error: ' + e.message); }
    return h(React.Fragment, null, walk(AST, [vals], 'r'));
  }
}

/** Mounts the prototype into `el`. opts: { props, hidePhotos }. Returns { restart(), setProps(patch) }. */
export function mountPrototype(el, opts = {}) {
  const root = createRoot(el);
  let n = 0, host = null;
  function render() {
    n++;
    const M = createPrototype(makeDCLogic());
    if (opts.hidePhotos) hideUnclearedPhotos(M);
    root.render(h(Host, { key: 'run' + n, M, appProps: Object.assign({ persist: false }, opts.props || {}), onReady: (x) => { host = x; } }));
  }
  render();
  return { restart: render, setProps: (p) => { Object.assign(opts.props || (opts.props = {}), p); if (host) host.setProps(p); } };
}
