#!/usr/bin/env node
// debug loader for import_geojson_to_firestore
// Usage (same arg order as import script):
//   node scripts/import_geojson_to_firestore_debug.js serviceAccount.json projectId input.geojson
// This script DOES NOT contact Firebase. It only reads and inspects the geojson file
// to help debug why the real import script reports "missing features[]".

const fs = require('fs');
const path = require('path');

if (process.argv.length < 5) {
  console.error('Usage: node scripts/import_geojson_to_firestore_debug.js serviceAccount.json projectId input.geojson');
  process.exit(1);
}

const serviceAccountPath = path.resolve(process.argv[2]);
const projectId = process.argv[3];
const geojsonPath = path.resolve(process.argv[4]);

console.log('serviceAccountPath:', serviceAccountPath);
console.log('projectId:', projectId);
console.log('geojsonPath:', geojsonPath);

let raw;
try {
  raw = fs.readFileSync(geojsonPath, 'utf8');
} catch (e) {
  console.error('Failed to read geojson file:', e.message);
  process.exit(2);
}

console.log('geojson file length:', raw.length);
console.log('geojson head (first 300 chars):\n', raw.slice(0,300).replace(/\n/g,'\\n'));

let geo;
try {
  geo = JSON.parse(raw);
} catch (e) {
  console.error('JSON parse error:', e.message);
  process.exit(3);
}

console.log('parsed.type:', geo.type);
console.log('has features array?:', Array.isArray(geo.features));
if (Array.isArray(geo.features)) {
  console.log('features.length:', geo.features.length);
  console.log('first feature keys:', Object.keys(geo.features[0] || {}).join(', '));
  console.log('first feature geometry type:', geo.features[0] && geo.features[0].geometry && geo.features[0].geometry.type);
  console.log('first feature sample properties keys:', Object.keys(geo.features[0] && geo.features[0].properties || {}).slice(0,10).join(', '));
}
console.log('debug done');
process.exit(0);
