#!/usr/bin/env node
// Usage: node scripts/check_duplicate_ids.js input.geojson
const fs = require('fs');
if (process.argv.length < 3) { console.error('Usage: node scripts/check_duplicate_ids.js input.geojson'); process.exit(1); }
const p = process.argv[2];
const raw = fs.readFileSync(p, 'utf8');
const geo = JSON.parse(raw);
if (!geo.features || !Array.isArray(geo.features)) { console.error('Invalid GeoJSON: missing features[]'); process.exit(2); }
console.log('Total features:', geo.features.length);
const counts = {};
for (let i = 0; i < geo.features.length; i++) {
  const f = geo.features[i];
  const possibleId = f.properties && (f.properties.id || f.properties.Id || f.properties.ID || f.properties.name);
  const docId = possibleId ? String(possibleId) : `loc-${i+1}`;
  counts[docId] = (counts[docId] || 0) + 1;
}
const duplicates = Object.entries(counts).filter(([id,c]) => c > 1);
if (duplicates.length === 0) {
  console.log('No duplicate docIds found.');
} else {
  console.log('Duplicate docIds:');
  duplicates.forEach(([id,c]) => console.log(`  ${id}: ${c}`));
}
