/**
 * import_geojson_to_firestore.js
 * Usage: node scripts/import_geojson_to_firestore.js serviceAccount.json projectId input.geojson
 *
 * Dependencies:
 *   npm install firebase-admin
 *
 * WARNING: keep service account JSON secure.
 */
const fs = require('fs');
const admin = require('firebase-admin');
const path = require('path');

if (process.argv.length < 5) {
  console.error('Usage: node scripts/import_geojson_to_firestore.js serviceAccount.json projectId input.geojson');
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

async function run() {
  const raw = fs.readFileSync(geojsonPath, 'utf8');
  const geo = JSON.parse(raw);
  if (!geo.features || !Array.isArray(geo.features)) {
    console.error('Invalid GeoJSON. Missing features[]');
    process.exit(2);
  }
  console.log(`Importing ${geo.features.length} features...`);
  for (let i = 0; i < geo.features.length; i++) {
    const f = geo.features[i];
    const possibleId = f.properties && (f.properties.id || f.properties.Id || f.properties.ID || f.properties.name);
    const docId = possibleId ? String(possibleId) : `loc-${i+1}`;
    const docRef = db.collection('locations').doc(docId);
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
