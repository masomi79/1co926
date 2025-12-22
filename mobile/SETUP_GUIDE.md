# Setup and Testing Guide for 1co926 Mobile App

## Initial Setup Completed

The Expo-managed React Native project has been successfully initialized with the following structure:

### ✅ Completed Components

1. **Project Structure**
   - Expo project created in `/mobile` directory
   - TypeScript configuration
   - Proper folder structure (screens, services, components, constants, types, navigation)

2. **Dependencies Installed**
   - Expo SDK 54
   - Firebase 12.6.0 (Authentication & Firestore)
   - React Navigation (native-stack)
   - React Native Maps
   - All dependencies verified for security vulnerabilities

3. **Core Services Implemented**
   - Firebase initialization (`src/services/firebase.ts`)
   - Authentication service (`src/services/auth.ts`)
   - Firestore service with CRUD operations (`src/services/firestore.ts`)

4. **Screens Created**
   - `LoginScreen.tsx` - Email/password authentication
   - `MapScreen.tsx` - Interactive map with location markers
   - `LocationDetailScreen.tsx` - Location details and visit recording

5. **Type Definitions**
   - Complete TypeScript types for Firestore schema
   - Navigation types
   - Visit result enum: 'Wal_Aisan' | 'Upla_Apu' | 'Kli_Wabia' | 'Upla_Iwras'

6. **Configuration**
   - Firebase config template in `src/constants/config.ts`
   - App.json configured with proper app name
   - Navigation structure with React Navigation

## Next Steps for User

### 1. Configure Firebase

Edit `mobile/src/constants/config.ts` and replace these values:

```typescript
export const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",              // ← Replace
  authDomain: "my-test-project-85b1b.firebaseapp.com",
  projectId: "my-test-project-85b1b",
  storageBucket: "my-test-project-85b1b.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // ← Replace
  appId: "YOUR_APP_ID",                // ← Replace
};
```

Get these values from:
1. Firebase Console → Project Settings
2. Under "Your apps", add or select a Web app
3. Copy the config object

### 2. Set Up Firebase Services

In Firebase Console:

1. **Enable Authentication**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   
2. **Enable Firestore**
   - Go to Firestore Database
   - Create database (production mode)
   - Deploy security rules from `/firestore.rules`

3. **Optional: Import Sample Data**
   ```bash
   cd /home/runner/work/1co926/1co926
   node scripts/kmz_to_geojson.js path/to/Territorio.kmz > output.geojson
   node scripts/import_geojson_to_firestore.js serviceAccount.json your-project-id output.geojson
   ```

### 3. Run the App

```bash
cd mobile
npm install  # Already done, but run if you clone fresh
npm start    # Start Expo dev server
```

Then:
- Press `i` for iOS Simulator (macOS only)
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on physical device

### 4. Test the App Flow

1. **Login Screen**
   - First time: Create an account using Firebase Console or implement registration
   - Enter email/password to sign in
   - Should navigate to Map screen on success

2. **Map Screen**
   - Displays all locations from Firestore as markers
   - Tap marker to view details
   - Logout button in footer

3. **Location Detail Screen**
   - View location information
   - Tap "Record Visit" button
   - Select visit result from modal
   - Visit saved to Firestore

## Verification Checklist

- [x] TypeScript compilation successful (no errors)
- [x] All files properly structured
- [x] Dependencies installed without vulnerabilities
- [x] Firebase services implemented correctly
- [x] Navigation configured
- [x] Screens implemented with proper UI
- [x] Data models match Firestore schema
- [ ] Firebase credentials configured (user action required)
- [ ] App tested on iOS/Android (requires Firebase setup)

## Known Limitations

1. **Firebase Configuration Required**: The app needs valid Firebase credentials to run
2. **Web Support**: Not installed (mobile-first approach)
3. **No Sample Data**: User must import locations or add them manually
4. **Admin Features**: Basic admin check implemented, but no admin UI screens yet

## Troubleshooting

### "Firebase not initialized" error
- Check that Firebase config in `src/constants/config.ts` has valid values
- Ensure Firebase project exists and Authentication is enabled

### "No locations found"
- Import data using the scripts in repository root
- Or manually add locations via Firebase Console

### Build errors
```bash
cd mobile
npx expo start -c  # Clear cache
rm -rf node_modules && npm install  # Reinstall
```

## What Works Out of the Box

✅ Complete project structure
✅ Type-safe TypeScript code
✅ Firebase Authentication integration
✅ Firestore database operations
✅ Navigation between screens
✅ Map display with markers
✅ Visit recording with enum selection
✅ Security: Firestore rules enforcing access control

## Files Created

```
mobile/
├── src/
│   ├── constants/config.ts         # Firebase & app configuration
│   ├── navigation/AppNavigator.tsx # Navigation setup
│   ├── screens/
│   │   ├── LoginScreen.tsx         # Authentication screen
│   │   ├── MapScreen.tsx           # Map with locations
│   │   └── LocationDetailScreen.tsx # Location details & visit recording
│   ├── services/
│   │   ├── firebase.ts             # Firebase initialization
│   │   ├── auth.ts                 # Auth operations
│   │   └── firestore.ts            # Database operations
│   └── types/
│       ├── firestore.ts            # Data models
│       └── navigation.ts           # Navigation types
├── App.tsx                         # Main entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
└── README.md                       # Detailed documentation
```

## Architecture Notes

- **Separation of Concerns**: Services layer abstracts Firebase operations
- **Type Safety**: Full TypeScript types for all data structures
- **Scalability**: Easy to add new screens, features, and services
- **Security**: Firestore rules enforce proper access control
- **Maintainability**: Clear folder structure and documentation

## Future Enhancements (Not Implemented Yet)

- Registration screen (users can be created in Firebase Console for now)
- Admin screens for managing locations
- Photo upload to Firebase Storage
- Visit history display
- Offline support
- User profile management
- Search and filter locations

---

**The MVP is ready for testing once Firebase credentials are configured!**
