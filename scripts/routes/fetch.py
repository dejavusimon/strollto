import json, sys, os, urllib.request, urllib.parse, time
S = json.load(open(sys.argv[1])); out = sys.argv[2]
URL = 'https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_CENTRELINE/FeatureServer/0/query'
CODES = '201200,201300,201400,201500,201600,201700,201800,201803,204001,204002'
for s in S:
    fn = os.path.join(out, s['id'] + '.json')
    if os.path.exists(fn): continue
    la = [t['lat'] for t in s['stops']]; lo = [t['lon'] for t in s['stops']]
    m = 0.006
    env = '%f,%f,%f,%f' % (min(lo) - m, min(la) - m, max(lo) + m, max(la) + m)
    feats = []; off = 0
    while True:
        q = {'where': 'FEATURE_CODE IN (%s)' % CODES, 'geometry': env, 'geometryType': 'esriGeometryEnvelope', 'inSR': 4326, 'spatialRel': 'esriSpatialRelIntersects',
             'outFields': 'LINEAR_NAME_FULL,FEATURE_CODE', 'returnGeometry': 'true', 'outSR': 4326, 'f': 'json', 'resultOffset': off, 'resultRecordCount': 2000}
        d = json.load(urllib.request.urlopen(URL + '?' + urllib.parse.urlencode(q), timeout=60))
        fs = d.get('features', []); feats += fs
        if not d.get('exceededTransferLimit') and len(fs) < 2000: break
        off += len(fs)
    json.dump([[f['attributes'].get('LINEAR_NAME_FULL') or '', f['attributes']['FEATURE_CODE'], f['geometry']['paths']] for f in feats], open(fn, 'w'))
    print(s['id'], len(feats)); time.sleep(0.5)
