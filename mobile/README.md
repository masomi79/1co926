# 1co926 Mobile App

Sales support tool mobile application built with Expo and React Native.

## Overview

This is a cross-platform (iOS/Android) mobile application for managing visit locations and recording visit results. The app uses Firebase for authentication and Firestore for data storage.

## Features

- **Authentication**: Email/password login using Firebase Authentication
- **Map View**: Display visit locations on an interactive map
- **Location Details**: View detailed information about each location
- **Visit Recording**: Record visit results with predefined options (Wal_Aisan, Upla_Apu, Kli_Wabia, Upla_Iwras)
- **Firestore Integration**: Real-time data synchronization with Firebase

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (installed automatically with npx)
- Firebase project with Authentication and Firestore enabled
- iOS Simulator (macOS only) or Android Emulator

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Firebase

Edit `src/constants/config.ts` and replace the placeholder values with your Firebase project credentials:

```typescript
export const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

You can find these credentials in your Firebase Console:
1. Go to Project Settings
2. Scroll down to "Your apps"
3. Select or add a Web app
4. Copy the config object

### 3. Firebase Setup

1. **Enable Authentication**:
   - In Firebase Console, go to Authentication → Sign-in method
   - Enable "Email/Password"

2. **Set up Firestore**:
   - In Firebase Console, go to Firestore Database
   - Create database (start in production mode)
   - Deploy the security rules from `/firestore.rules` in the repository root

3. **Import Locations** (Optional):
   - Use the scripts in the repository root to import KMZ data:
   ```bash
   cd ..
   node scripts/kmz_to_geojson.js path/to/Territorio.kmz > output.geojson
   node scripts/import_geojson_to_firestore.js serviceAccount.json your-project-id output.geojson
   ```

### 4. Run the App

Start the Expo development server:

```bash
npm start
```

Then choose your platform:
- Press `i` for iOS Simulator (macOS only)
- Press `a` for Android Emulator
- Press `w` for Web browser
- Scan QR code with Expo Go app on your physical device

## Project Structure

```
mobile/
├── src/
│   ├── components/        # Reusable UI components
│   ├── constants/         # Configuration and constants
│   │   └── config.ts      # Firebase config and app constants
│   ├── navigation/        # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/           # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── MapScreen.tsx
│   │   └── LocationDetailScreen.tsx
│   ├── services/          # External service integrations
│   │   ├── firebase.ts    # Firebase initialization
│   │   ├── auth.ts        # Authentication service
│   │   └── firestore.ts   # Firestore database service
│   └── types/             # TypeScript type definitions
│       ├── firestore.ts   # Firestore data models
│       └── navigation.ts  # Navigation types
├── App.tsx               # Main app entry point
├── app.json             # Expo configuration
└── package.json         # Dependencies
```

## Data Models

### Location
```typescript
{
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  category?: string;
  source?: string;
  createdBy?: string;
  createdAt: Date;
}
```

### Visit
```typescript
{
  id?: string;
  userId: string;
  locationId: string;
  result: 'Wal_Aisan' | 'Upla_Apu' | 'Kli_Wabia' | 'Upla_Iwras';
  timestamp: Date;
  note?: string;
  photoUrl?: string;
  createdAt: Date;
}
```

## Security

- Firestore security rules enforce that users can only create visits with their own userId
- Admin users (with custom claims) can manage locations and delete any visits
- All operations require authentication

## Development

### Adding New Screens

1. Create screen component in `src/screens/`
2. Add route type to `src/types/navigation.ts`
3. Register screen in `src/navigation/AppNavigator.tsx`

### Extending Firestore Services

- Add new functions to `src/services/firestore.ts`
- Follow the existing patterns for error handling and type safety

## Building for Production

### iOS

```bash
npm run ios -- --configuration Release
```

For App Store submission, use EAS Build:
```bash
npx eas build --platform ios
```

### Android

```bash
npm run android -- --variant=release
```

For Play Store submission, use EAS Build:
```bash
npx eas build --platform android
```

## Troubleshooting

### Firebase Connection Issues
- Verify your Firebase config in `src/constants/config.ts`
- Check that Authentication and Firestore are enabled in Firebase Console
- Ensure Firestore security rules are deployed

### Map Not Displaying
- On Android, ensure Google Play Services are installed in the emulator
- Check that location permissions are granted
- Verify that locations exist in Firestore

### Build Errors
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo: `npx expo install --fix`

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)

## License

MIT
