#!/usr/bin/env node
/**
 * import_geojson_to_firestore_safe.js
 * Usage:
 *   COLLECTION=test_locations node scripts/import_geojson_to_firestore_safe.js /path/to/serviceAccount.json projectId input.geojson
 *
 * - COLLECTION env var (optional) sets the Firestore collection name (default 'locations').
 * - This script sanitizes doc IDs derived from properties and uses set().
 * - WARNING: keep service account JSON secure.
 */
const fs = require('fs');
const admin = require('firebase-admin');
const path = require('path');

if (process.argv.length < 5) {
  console.error('Usage: node scripts/import_geojson_to_firestore_safe.js serviceAccount.json projectId input.geojson');
  process.exit(1);
}

const serviceAccountPath = path.resolve(process.argv[2]);
const projectId = process.argv[3];
const geojsonPath = path.resolve(process.argv[4]);

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: projectId,
});

const db = admin.firestore();

function sanitizeId(s){
  if(!s) return null;
  // trim, replace slashes/backslashes with '-', collapse spaces, limit length
  let id = String(s).trim().replace(/[\/\\]+/g,'-').replace(/\s+/g,' ').slice(0,400);
  id = id.replace(/^[.$]+/,'').replace(/\0/g,'');
  return id || null;
}

async function run() {
  const raw = fs.readFileSync(geojsonPath, 'utf8');
  const geo = JSON.parse(raw);
  if (!geo.features || !Array.isArray(geo.features)) {
    console.error('Invalid GeoJSON. Missing features[]');
    process.exit(2);
  }
  const collectionName = process.env.COLLECTION || 'locations';
  console.log(`Importing ${geo.features.length} features into collection '${collectionName}'...`);
  for (let i = 0; i < geo.features.length; i++) {
    const f = geo.features[i];
    const possibleId = f.properties && (f.properties.id || f.properties.Id || f.properties.ID || f.properties.name);
    const rawId = possibleId ? String(possibleId) : `loc-${i+1}`;
    const docId = sanitizeId(rawId) || `loc-${i+1}`;
    const docRef = db.collection(collectionName).doc(docId);
    await docRef.set({
      geometry: f.geometry || null,
      properties: f.properties || {},
      importedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    if ((i+1) % 50 === 0) console.log(`Imported ${i+1}`);
  }
  console.log('Import complete.');
  process.exit(0);
}

run().catch(err => {
  console.error('Import failed:', err);
  process.exit(3);
});