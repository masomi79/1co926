#!/usr/bin/env node
// dry_run_import.js
// Usage:
//   node scripts/dry_run_import.js input.geojson [limit]
// Shows what would be written to Firestore (docId and a small preview) without contacting Firestore.

const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Usage: node scripts/dry_run_import.js input.geojson [limit]');
  process.exit(1);
}

const geojsonPath = process.argv[2];
const limit = parseInt(process.argv[3] || '10', 10);

let raw;
try {
  raw = fs.readFileSync(geojsonPath, 'utf8');
} catch (e) {
  console.error('Cannot read file:', geojsonPath, e.message);
  process.exit(2);
}

let geo;
try {
  geo = JSON.parse(raw);
} catch (e) {
  console.error('Invalid JSON:', e.message);
  process.exit(3);
}

if (!geo.features || !Array.isArray(geo.features)) {
  console.error('Invalid GeoJSON. Missing features[]');
  process.exit(4);
}

console.log(`Features: ${geo.features.length}. Showing up to ${limit} items:\n`);

function preview(obj, n=3){
  if (!obj || typeof obj !== 'object') return obj;
  // only show first n keys
  const keys = Object.keys(obj).slice(0, n);
  const out = {};
  for (const k of keys) out[k] = obj[k];
  if (Object.keys(obj).length > n) out.__more = Object.keys(obj).length - n;
  return out;
}

for (let i = 0; i < Math.min(limit, geo.features.length); i++){
  const f = geo.features[i];
  const possibleId = f.properties && (f.properties.id || f.properties.Id || f.properties.ID || f.properties.name);
  const docId = possibleId ? String(possibleId) : `loc-${i+1}`;
  const geomType = f.geometry && f.geometry.type ? f.geometry.type : null;
  const firstCoord = (() => {
    try {
      // try common nesting patterns
      const c = f.geometry && f.geometry.coordinates;
      if (!c) return null;
      let sample = c;
      while (Array.isArray(sample) && sample.length && Array.isArray(sample[0])) sample = sample[0];
      return Array.isArray(sample) ? sample.slice(0,3) : sample;
    } catch (e) { return null; }
  })();
  console.log(`#${i+1} docId: ${docId}`);
  console.log('  geometry.type:', geomType);
  console.log('  firstCoord:', JSON.stringify(firstCoord));
  console.log('  properties preview:', JSON.stringify(preview(f.properties || {}), null, 2));
  console.log('');
}

if (geo.features.length > limit) {
  console.log(`... ${geo.features.length - limit} more features omitted.`);
}
