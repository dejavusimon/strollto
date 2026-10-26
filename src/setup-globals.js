// The design-system bundle (src/ds/bundle.js) is a classic script that reads window.React
// and registers its components on window.StrollTO. This module runs first so both exist.
import React from 'react';
import { qrPath } from './qr.js';

window.React = React;
// The prototype logic draws a real QR code when this encoder is present.
window.StrollTOQR = qrPath;
