#!/usr/bin/env node
/**
 * kmz_to_geojson.js
 * Usage: node scripts/kmz_to_geojson.js input.kmz > output.geojson
 *
 * Dependencies:
 *   npm install adm-zip xmldom @tmcw/togeojson
 */
const fs = require('fs');
const AdmZip = require('adm-zip');
const { DOMParser } = require('xmldom');
const tj = require('@tmcw/togeojson');

if (process.argv.length < 3) {
  console.error('Usage: node scripts/kmz_to_geojson.js input.kmz > output.geojson');
  process.exit(1);
}

const kmzPath = process.argv[2];

try {
  const zip = new AdmZip(kmzPath);
  const entries = zip.getEntries();
  const kmlEntry = entries.find(e => e.entryName.toLowerCase().endsWith('.kml'));
  if (!kmlEntry) {
    console.error('No KML file found inside KMZ.');
    process.exit(2);
  }
  const kmlText = kmlEntry.getData().toString('utf8');
  const kmlDom = new DOMParser().parseFromString(kmlText, 'text/xml');
  const geojson = tj.kml(kmlDom);
  console.log(JSON.stringify(geojson, null, 2));
} catch (err) {
  console.error('Error processing KMZ:', err);
  process.exit(3);
}
