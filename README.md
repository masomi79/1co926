# 1co926 - Sales Support Tool

A cross-platform mobile application for managing visit locations and recording visit results, with data import utilities for KMZ/GeoJSON.

## Project Structure

This repository contains two main components:

### 1. Mobile Application (`/mobile`)
- **Expo-managed React Native app** for iOS and Android
- Firebase Authentication (email/password)
- Firestore database integration
- Interactive map with location markers
- Visit recording with predefined results

[See Mobile App README →](./mobile/README.md)

### 2. Data Import Scripts (`/scripts`)
- KMZ → GeoJSON conversion utility
- GeoJSON → Firestore import tool
- Used to populate location data from KMZ files

## Quick Start

### Mobile App Setup

```bash
cd mobile
npm install
# Configure Firebase in src/constants/config.ts
npm start
```

### Data Import Scripts

```bash
# Install dependencies (root)
npm install

# Convert KMZ to GeoJSON
node scripts/kmz_to_geojson.js path/to/Territorio.kmz > output.geojson

# Import to Firestore (requires service account)
node scripts/import_geojson_to_firestore.js serviceAccount.json your-project-id output.geojson
```

## Documentation

- [REQUIREMENTS.md](./docs/REQUIREMENTS.md) - Full requirements and specifications
- [FIRESTORE_SCHEMA.md](./docs/FIRESTORE_SCHEMA.md) - Database schema documentation
- [ROADMAP.md](./docs/ROADMAP.md) - Development roadmap
- [firestore.rules](./firestore.rules) - Firestore security rules

## Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com)
2. **Enable Authentication**: Email/Password sign-in method
3. **Enable Firestore**: Create database in production mode
4. **Deploy Security Rules**: Use `firestore.rules` from this repository
5. **Configure Mobile App**: Add Firebase config to `mobile/src/constants/config.ts`

## Data Models

### Collections

- **locations**: Visit locations (imported from KMZ or manually created)
  - Fields: id, name, description, lat, lng, category, source, createdBy, createdAt
  
- **visits**: Visit records created by users
  - Fields: userId, locationId, result, timestamp, note, photoUrl, createdAt
  - Result values: "Wal_Aisan", "Upla_Apu", "Kli_Wabia", "Upla_Iwras"

- **users**: User profiles (optional)
  - Fields: uid, displayName, email, role, createdAt

## Security

- Firestore security rules enforce proper access control
- Users can only create visits with their own userId
- Admin users (custom claims) can manage locations
- Service account keys must never be committed to the repository

## Requirements

- Node.js v18+ (LTS recommended)
- npm or yarn
- Firebase project with Authentication and Firestore enabled
- For mobile development: iOS Simulator (macOS) or Android Emulator

## Important Notes

⚠️ **NEVER commit `serviceAccount.json`** - Keep Firebase admin keys secure and add them to `.gitignore`

⚠️ **Configure Firebase** - Replace placeholder values in `mobile/src/constants/config.ts` with your actual Firebase credentials

## License

MIT

---

概要:
- KMZ（Google Earth の圧縮形式）を GeoJSON に変換するスクリプト
- GeoJSON を Firebase Firestore にインポートするスクリプト
- モバイルアプリ（Expo + React Native）でマップ表示と訪問記録

注意:
- serviceAccount.json（Firebase 管理者キー）は安全に保管し、リポジトリにコミットしないでください。
- Firestore のコレクション名は scripts 内で `locations` にしています。必要なら変更してください。
- Node.js の LTS を使ってください（nvm を推奨）。

