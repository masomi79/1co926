# Firestore Schema Documentation

## Overview
This document describes the Firestore data model for the 1co926 project, including collections, field definitions, security considerations, and operational guidance.

**Project ID (example)**: `my-test-project-85b1b`

## Applying Security Rules

### Using Firebase CLI
1. Install the Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init firestore
   ```
   Select your project (`my-test-project-85b1b`) and specify `firestore.rules` as your rules file.

4. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Setting Admin Custom Claims

**Option 1: Using Firebase Admin SDK (recommended for production)**

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

async function setAdminClaim(uid) {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log(`Admin claim set for user: ${uid}`);
}

// Usage: setAdminClaim('user-uid-here');
```

**Option 2: Using gcloud CLI**

```bash
# Set admin custom claim
gcloud auth application-default login
# Then use Firebase Admin SDK as shown above, or use a Cloud Function
```

**Option 3: Using Firebase Console (via Cloud Functions)**

Create and deploy a callable Cloud Function that sets custom claims, then call it from the Firebase Console or your application with proper authentication.

**Important**: After setting custom claims, the user must sign out and sign back in for the new claims to take effect.

---

## Collections

### 1. locations

Stores geographic locations (points of interest) that users can visit.

**Document ID**: String (unique identifier, often imported from source data)

#### Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | Optional | Redundant storage of document ID | `"loc_001"` |
| `name` | string | Required | Display name of the location | `"Wal Aisan Community Center"` |
| `description` | string | Optional | Detailed description of the location | `"Main community gathering place"` |
| `lat` | number | Required | Latitude coordinate | `-5.123456` |
| `lng` | number | Required | Longitude coordinate | `142.654321` |
| `category` | string | Optional | Category or type of location | `"community"` |
| `source` | string | Optional | Origin of the data | `"imported"` or `"manual"` |
| `createdBy` | string | Optional | User ID (uid) of creator | `"uid_abc123"` |
| `createdAt` | timestamp | Required | Creation timestamp | `Timestamp(2024, 0, 15, 10, 30, 0)` |
| `properties` | map | Optional | Additional metadata from source | `{ "region": "East", "altitude": 250 }` |

#### Example Document

```json
{
  "id": "loc_wal_aisan_01",
  "name": "Wal Aisan Village Center",
  "description": "Primary community center for Wal Aisan village",
  "lat": -5.123456,
  "lng": 142.654321,
  "category": "community_center",
  "source": "imported",
  "createdBy": "admin_uid_123",
  "createdAt": "2024-01-15T10:30:00Z",
  "properties": {
    "region": "Eastern Highlands",
    "population": 350,
    "altitude": 1200
  }
}
```

---

### 2. visits

Records user visits to locations with results and optional metadata.

**Document ID**: Auto-generated

#### Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `userId` | string | Required | User ID (uid) who made the visit | `"uid_user123"` |
| `locationId` | string | Required | Reference to locations document ID | `"loc_wal_aisan_01"` |
| `result` | string (enum) | Required | Visit outcome (see enum values below) | `"Wal_Aisan"` |
| `timestamp` | timestamp | Required | When the visit occurred | `Timestamp(2024, 2, 20, 14, 30, 0)` |
| `note` | string | Optional | User's notes about the visit | `"Met with local leaders"` |
| `photoUrl` | string | Optional | URL to photo in Firebase Storage | `"gs://bucket/photos/visit123.jpg"` |
| `createdAt` | timestamp | Required | Record creation timestamp (server) | `Timestamp(2024, 2, 20, 14, 35, 0)` |

#### Visit Result Enum Values

The `result` field must be one of the following values:

- `"Wal_Aisan"` - Wal Aisan outcome
- `"Upla_Apu"` - Upla Apu outcome
- `"Kli_Wabia"` - Kli Wabia outcome
- `"Upla_Iwras"` - Upla Iwras outcome

These enum values are enforced by Firestore security rules.

#### Example Document

```json
{
  "userId": "uid_user123",
  "locationId": "loc_wal_aisan_01",
  "result": "Wal_Aisan",
  "timestamp": "2024-03-20T14:30:00Z",
  "note": "Successful community meeting. All participants present.",
  "photoUrl": "https://firebasestorage.googleapis.com/.../photo.jpg",
  "createdAt": "2024-03-20T14:35:00Z"
}
```

---

### 3. users

Stores user profile information and roles (supplementary to Firebase Authentication).

**Document ID**: User UID (matches Firebase Auth uid)

#### Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `displayName` | string | Optional | User's display name | `"John Doe"` |
| `email` | string | Required | User's email address | `"john.doe@example.com"` |
| `role` | string | Required | User role for reference | `"admin"` or `"user"` |
| `createdAt` | timestamp | Required | Account creation timestamp | `Timestamp(2024, 0, 10, 9, 0, 0)` |
| `lastLogin` | timestamp | Optional | Last login timestamp | `Timestamp(2024, 3, 15, 10, 30, 0)` |

**Note**: The `role` field in this collection is for reference/display purposes. The authoritative role check uses custom claims (`request.auth.token.admin`) in security rules.

#### Example Document

```json
{
  "displayName": "Jane Admin",
  "email": "jane.admin@example.com",
  "role": "admin",
  "createdAt": "2024-01-10T09:00:00Z",
  "lastLogin": "2024-04-15T10:30:00Z"
}
```

---

## Example Firestore Queries

### JavaScript SDK Examples

```javascript
import { collection, query, where, getDocs, addDoc, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase-config';

// Get all locations
const locationsRef = collection(db, 'locations');
const locationsSnapshot = await getDocs(locationsRef);
const locations = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// Get visits for a specific user
const visitsRef = collection(db, 'visits');
const userVisitsQuery = query(
  visitsRef,
  where('userId', '==', currentUserId),
  orderBy('timestamp', 'desc')
);
const userVisits = await getDocs(userVisitsQuery);

// Get visits for a specific location
const locationVisitsQuery = query(
  visitsRef,
  where('locationId', '==', 'loc_wal_aisan_01'),
  orderBy('timestamp', 'desc'),
  limit(20)
);
const locationVisits = await getDocs(locationVisitsQuery);

// Get visits with specific result
const resultVisitsQuery = query(
  visitsRef,
  where('result', '==', 'Wal_Aisan'),
  orderBy('timestamp', 'desc')
);
const resultVisits = await getDocs(resultVisitsQuery);

// Create a new visit
const newVisit = {
  userId: currentUserId,
  locationId: 'loc_wal_aisan_01',
  result: 'Wal_Aisan',
  timestamp: new Date(),
  note: 'Productive meeting',
  createdAt: new Date()
};
const visitRef = await addDoc(collection(db, 'visits'), newVisit);

// Get user profile
const userDoc = await getDoc(doc(db, 'users', currentUserId));
const userProfile = userDoc.data();
```

---

## Firestore Indexes

The following composite indexes are recommended for optimal query performance:

### visits Collection

1. **User visits ordered by time**:
   - Collection: `visits`
   - Fields: `userId` (Ascending), `timestamp` (Descending)
   - Query scope: Collection

2. **Location visits ordered by time**:
   - Collection: `visits`
   - Fields: `locationId` (Ascending), `timestamp` (Descending)
   - Query scope: Collection

3. **Result-based queries with time ordering**:
   - Collection: `visits`
   - Fields: `result` (Ascending), `timestamp` (Descending)
   - Query scope: Collection

### Creating Indexes

Indexes can be created automatically when you run queries in development mode (Firestore will provide a link to create the index), or manually via:

1. **Firebase Console**: 
   - Go to Firestore Database → Indexes → Create Index
   - Specify collection and fields

2. **Firebase CLI**: 
   - Define indexes in `firestore.indexes.json` and deploy:
     ```bash
     firebase deploy --only firestore:indexes
     ```

Example `firestore.indexes.json`:
```json
{
  "indexes": [
    {
      "collectionGroup": "visits",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "visits",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "locationId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## Backup and Data Management

### Automated Backups

**Recommended approach**: Set up scheduled exports using Cloud Scheduler and Cloud Functions or gcloud.

```bash
# Manual export using gcloud
gcloud firestore export gs://my-test-project-85b1b-backups/$(date +%Y%m%d-%H%M%S)

# Example scheduled export (Cloud Scheduler + Cloud Function)
# Create a Cloud Function that calls:
const admin = require('firebase-admin');
const client = new admin.firestore.v1.FirestoreAdminClient();

const bucket = 'gs://my-test-project-85b1b-backups';
const projectId = 'my-test-project-85b1b';
const databaseName = client.databasePath(projectId, '(default)');

async function exportFirestore() {
  const responses = await client.exportDocuments({
    name: databaseName,
    outputUriPrefix: `${bucket}/${new Date().toISOString()}`,
    collectionIds: [] // Empty array exports all collections
  });
  console.log(`Export operation: ${responses[0].name}`);
}
```

### Manual Backup via Firebase Console

1. Go to Cloud Console → Firestore → Import/Export
2. Select collections to export (or leave empty for all)
3. Specify GCS bucket for export destination
4. Click Export

### Restore from Backup

```bash
gcloud firestore import gs://my-test-project-85b1b-backups/BACKUP_TIMESTAMP/
```

### Backup Schedule Recommendations

- **Small projects (<1000 documents)**: Weekly backups
- **Medium projects (1000-10000 documents)**: Daily backups
- **Active projects (>10000 documents or high write volume)**: Daily backups with retention policy

**Retention**: Keep at least 30 days of backups, with weekly/monthly archives for longer-term retention.

---

## Security Best Practices

1. **Never commit service account keys** to version control
2. **Use custom claims** for role-based access control (admin vs. user)
3. **Test security rules** in the Firebase Console Rules Playground before deploying to production
4. **Enable App Check** for production apps to prevent abuse
5. **Monitor Firestore usage** in Firebase Console to detect anomalies
6. **Use Firebase Emulator Suite** for local development and testing
7. **Review security rules regularly** as your application evolves
8. **Implement rate limiting** for sensitive operations via Cloud Functions if needed

---

## Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Data Modeling Best Practices](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firestore Backup and Restore](https://cloud.google.com/firestore/docs/backups)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

## Notes

- This schema is designed for a small-scale application with up to 50 concurrent users
- The `visit.result` enum values are specific to this project's domain requirements
- Security rules assume Firebase Authentication is configured and users are authenticated
- Location coordinates use standard latitude/longitude (WGS84 coordinate system)
- All timestamps should use Firestore's server timestamp for consistency
- The `users` collection is optional but recommended for storing user preferences and display information
