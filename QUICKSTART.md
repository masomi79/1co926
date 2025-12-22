# Quick Start Guide

## Get Started in 5 Minutes

### Prerequisites
- Node.js v18+ installed
- Firebase project created
- iOS Simulator (macOS) or Android Emulator installed

### Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `my-test-project-85b1b` (or create new)
3. Click ⚙️ → Project Settings
4. Scroll to "Your apps" section
5. Click "Add app" → Web (</>) icon
6. Copy the config object

### Step 2: Configure the App

Edit `mobile/src/constants/config.ts`:

```typescript
export const FIREBASE_CONFIG = {
  apiKey: "AIza...",              // ← Paste your values here
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};
```

### Step 3: Enable Firebase Services

**Authentication:**
1. Go to Authentication → Sign-in method
2. Enable "Email/Password"
3. Click Save

**Firestore:**
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Production mode"
4. Select a location
5. Click Enable

**Deploy Security Rules:**
```bash
# In repository root
firebase deploy --only firestore:rules
# Or manually copy from firestore.rules in Firebase Console
```

### Step 4: Run the App

```bash
cd mobile
npm install  # Install dependencies (if not done)
npm start    # Start Expo dev server
```

Press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR with Expo Go app (on phone)

### Step 5: Create Test User

**Option A: Firebase Console**
1. Go to Authentication → Users
2. Click "Add user"
3. Enter email and password
4. Click "Add user"

**Option B: In the app**
- Use the implemented sign-up flow (email/password)

### Step 6: Import Sample Locations (Optional)

```bash
# In repository root
node scripts/kmz_to_geojson.js path/to/file.kmz > output.geojson
node scripts/import_geojson_to_firestore.js serviceAccount.json your-project-id output.geojson
```

Get `serviceAccount.json`:
1. Firebase Console → Project Settings → Service accounts
2. Click "Generate new private key"
3. Save as `serviceAccount.json` (DO NOT COMMIT!)

### Step 7: Test the App

1. **Login**
   - Enter the test user email/password
   - Click "Sign In"
   - You should see the Map screen

2. **View Locations**
   - Map displays all locations from Firestore
   - Tap a marker to view details

3. **Record a Visit**
   - On location detail screen
   - Tap "Record Visit"
   - Select a result (e.g., "Wal Aisan")
   - Visit saved to Firestore ✅

### Troubleshooting

**"Firebase not initialized" error:**
- Check Firebase config in `src/constants/config.ts`
- Verify project ID matches

**"No locations found":**
- Import data using scripts
- Or add manually in Firebase Console → Firestore → Create document

**Build errors:**
```bash
cd mobile
npx expo start -c  # Clear cache
rm -rf node_modules && npm install  # Reinstall
```

**Map not loading:**
- Ensure location permissions granted
- Check Google Play Services (Android)

### What's Next?

✅ Your MVP is running!

**Optional enhancements:**
- Add registration screen
- Create admin interface
- Add photo upload
- Implement search/filter
- Enable offline mode

### Need Help?

- 📖 [Mobile App README](./mobile/README.md)
- 📋 [Setup Guide](./mobile/SETUP_GUIDE.md)
- 🎯 [Requirements](./docs/REQUIREMENTS.md)
- 📊 [Firestore Schema](./docs/FIRESTORE_SCHEMA.md)

### Project Structure at a Glance

```
mobile/
├── src/
│   ├── screens/          → LoginScreen, MapScreen, LocationDetailScreen
│   ├── services/         → firebase, auth, firestore operations
│   ├── components/       → Reusable UI (Button)
│   ├── constants/        → Firebase config
│   └── types/            → TypeScript definitions
└── App.tsx              → Entry point
```

---

**Estimated time: 5 minutes** ⏱️

**Difficulty: Easy** ⭐

**Result: Working MVP** ✅
