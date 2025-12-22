const admin = require('firebase-admin');
const projectId = process.env.FIREBASE_PROJECT_ID;
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!projectId || !credPath) {
  console.error('env が足りません');
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert(require(credPath)), projectId });
const db = admin.firestore();
(async () => {
  const snap = await db.collection('locations').limit(5).get();
  console.log('count (first 5):', snap.size);
  snap.forEach(d => console.log(d.id, d.data()));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
