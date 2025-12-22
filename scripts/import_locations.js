// scripts/import_locations.js
const fs = require("fs");
const admin = require("firebase-admin");

const projectId = process.env.FIREBASE_PROJECT_ID;
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!projectId || !credPath) {
  console.error("FIREBASE_PROJECT_ID と GOOGLE_APPLICATION_CREDENTIALS を設定してください。");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(credPath)),
  projectId,
});
const db = admin.firestore();

async function main() {
  const geojsonPath = process.argv[2];
  if (!geojsonPath) {
    console.error("Usage: node scripts/import_locations.js <geojson-file>");
    process.exit(1);
  }

  const raw = fs.readFileSync(geojsonPath, "utf8");
  const data = JSON.parse(raw);

  if (data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
    throw new Error("GeoJSON は FeatureCollection を想定しています。");
  }

  const batch = db.batch();
  let count = 0;

  for (const feature of data.features) {
    if (!feature.geometry || feature.geometry.type !== "Point") {
      console.warn("Point 以外のジオメトリはスキップ:", feature.properties?.id);
      continue;
    }
    const [lng, lat] = feature.geometry.coordinates;
    const props = feature.properties || {};

    // ドキュメントID: props.id があればそれを使う。なければ Firestore に自動生成させる。
    const docId = props.id ? String(props.id) : undefined;
    const ref = docId
      ? db.collection("locations").doc(docId)
      : db.collection("locations").doc();

    const doc = {
      id: docId || ref.id,
      name: props.name || "",
      description: props.description || "",
      type: props.type || "",
      lat,
      lng,
      source: "imported",
      properties: props,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    batch.set(ref, doc);
    count++;

    // batch は 500 件まで。超えそうならコミットして新しく作る。
    if (count % 500 === 0) {
      console.log(`Committing batch at ${count} docs`);
      await batch.commit();
    }
  }

  if (count % 500 !== 0) {
    await batch.commit();
  }

  console.log(`Done. Imported ${count} docs.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});