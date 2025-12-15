# Operations & Safety (short checklist)

This document collects the operational steps used and next steps to run imports safely for this project (1co926).

## Local key handling
- Move keys out of repo:
  mkdir -p ~/private-keys
  mv ./keys/*.json ~/private-keys/
  chmod 600 ~/private-keys/*.json
- Make sure `/keys/` is in `.gitignore` and committed.

## Key rotation (GCP)
1. Create a new service account with minimal role (e.g. Firestore write only).
2. Create a new key for that account and download it.
3. Use the new key locally for imports.
4. Delete the old key in GCP Console -> IAM & Admin -> Service Accounts -> Keys.

## Backup Firestore
- To export to GCS:
  gcloud firestore export gs://YOUR_BUCKET_NAME/backup-YYYYMMDD --project=PROJECT_ID
- To restore, use the corresponding import command (see GCP docs).

## Importing GeoJSON (batched)
- Example:
  COLLECTION=test_locations node scripts/import_geojson_to_firestore_batched.js ~/private-keys/importer-key.json YOUR_PROJECT_ID path/to/output_2d.geojson 400
- Notes:
  - Default batch size is 400 (safe below Firestore 500 limit).
  - This script uses `set()` and will overwrite docs with same IDs.
  - Stop the process with Ctrl+C; consider deleting/rotating the service account key if you need to immediately prevent writes.

## Monitoring & budgets
- For Blaze projects, configure Billing -> Budgets & alerts.
- Monitor Firestore usage in Firebase Console -> Usage.

## Emergency stop
- Delete the service account key in GCP Console to immediately prevent further writes from that key.
