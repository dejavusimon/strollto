// QR code for the "Send to my phone" handoff, drawn as one SVG path (1 unit = 1 module).
import qrcode from 'qrcode-generator';

const cache = new Map();

/** Returns { size, path } for `text`, or null if it can't be encoded. */
export function qrPath(text) {
  if (cache.has(text)) return cache.get(text);
  let result = null;
  try {
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += 'M' + c + ' ' + r + 'h1v1h-1z';
    result = { size: n, path: d };
  } catch (e) {
    console.warn('QR encode failed', e);
  }
  cache.set(text, result);
  return result;
}
