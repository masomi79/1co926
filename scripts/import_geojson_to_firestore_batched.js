#!/usr/bin/env node
/**
 * import_geojson_to_firestore_batched.js
 * Usage:
 *   node scripts/import_geojson_to_firestore_batched.js serviceAccount.json projectId input.geojson [batchSize]
 *
 * Optional env:
 *   COLLECTION - collection name (default 'locations')
 *
 * Behavior:
 *  - Reads all features and writes them in batches using writeBatch (max 500 ops per batch).
 *  - Sanitizes docIds derived from properties.name / id.
 *  - Retries failed batch commits up to 3 times with exponential backoff.
 *
 * WARNING: still writes (set) documents — will overwrite existing docs with same IDs.
 */
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

if (process.argv.length < 5) {
  console.error('Usage: node scripts/import_geojson_to_firestore_batched.js serviceAccount.json projectId input.geojson [batchSize]');
  process.exit(1);
}

const serviceAccountPath = path.resolve(process.argv[2]);
const projectId = process.argv[3];
const geojsonPath = path.resolve(process.argv[4]);
const batchSize = parseInt(process.argv[5] || process.env.BATCH_SIZE || '400', 10); // safe default < 500
const collectionName = process.env.COLLECTION || 'locations';

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (e) {
  console.error('Failed to load service account JSON:', e.message);
  process.exit(2);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId,
});
const db = admin.firestore();

function sanitizeId(s){
  if(!s) return null;
  let id = String(s).trim().replace(/[\/\\]+/g,'-').replace(/\s+/g,' ').slice(0,400);
  id = id.replace(/^[.$]+/,'').replace(/\0/g,'');
  return id || null;
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function commitWithRetry(batch, attempt=1){
  try {
    await batch.commit();
    return;
  } catch (err) {
    if (attempt >= 3) throw err;
    const wait = 500 * Math.pow(2, attempt-1);
    console.warn(`Batch commit failed (attempt ${attempt}), retrying in ${wait}ms:`, err.message || err);
    await sleep(wait);
    return commitWithRetry(batch, attempt+1);
  }
}

async function run(){
  let raw;
  try {
    raw = fs.readFileSync(geojsonPath,'utf8');
  } catch (e) {
    console.error('Failed to read geojson file:', e.message);
    process.exit(2);
  }

  let geo;
  try {
    geo = JSON.parse(raw);
  } catch (e) {
    console.error('JSON parse error:', e.message);
    process.exit(3);
  }

  if (!geo.features || !Array.isArray(geo.features)) {
    console.error('Invalid GeoJSON. Missing features[]');
    process.exit(4);
  }
  const total = geo.features.length;
  console.log(`Importing ${total} features into '${collectionName}' with batchSize=${batchSize}...`);
  let processed = 0;
  for (let i = 0; i < total; i += batchSize){
    const batch = db.batch();
    const slice = geo.features.slice(i, i + batchSize);
    for (let j = 0; j < slice.length; j++){
      const f = slice[j];
      const possibleId = f.properties && (f.properties.id || f.properties.Id || f.properties.ID || f.properties.name);
      const rawId = possibleId ? String(possibleId) : `loc-${i+j+1}`;
      const docId = sanitizeId(rawId) || `loc-${i+j+1}`;
      const docRef = db.collection(collectionName).doc(docId);
      batch.set(docRef, {
        geometry: f.geometry || null,
        properties: f.properties || {},
        importedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    // commit with retry
    try {
      await commitWithRetry(batch);
    } catch (err) {
      console.error('Batch commit failed after retries:', err);
      process.exit(5);
    }
    processed += slice.length;
    console.log(`Committed ${processed}/${total}`);
    // small throttle to avoid bursts
    await sleep(100);
  }
  console.log('All done.');
  process.exit(0);
}

run().catch(err=>{
  console.error('Import failed:', err);
  process.exit(6);
});
