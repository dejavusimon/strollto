# Street routes between stops

Rebuilds `PAIR_LEGS` (street routes between every two stops of each guided stroll) from the City of Toronto centreline.

1. `node stops.js <path to Main.dc.html> stops.json` lists each guided stroll's stops and existing legs.
2. `python3 fetch.py stops.json raw` downloads the walkable centreline around each stroll (City of Toronto open data, ArcGIS).
3. `python3 pairs.py stops.json raw pairs.json` routes every pair (laneways cost 2.5×; a stop snaps to the street in its address). It falls back to joining the stroll's own legs when that is shorter, and to a straight walk for very short hops.
4. Paste `pairs.json` as `var PAIR_LEGS = …;` in the design file.
