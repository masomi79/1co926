/**
 * Firestore data types for 1co926 Sales Support Tool
 */

// Visit result enum as defined in FIRESTORE_SCHEMA.md
export type VisitResult = 'Wal_Aisan' | 'Upla_Apu' | 'Kli_Wabia' | 'Upla_Iwras';

// Location type - represents a place to visit
export interface Location {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  category?: string;
  source?: string; // e.g., "imported" | "manual"
  createdBy?: string; // uid of creator
  createdAt: Date;
  properties?: Record<string, any>; // raw properties from GeoJSON
}

// Visit type - represents a visit record
export interface Visit {
  id?: string; // document ID (auto-generated)
  userId: string; // uid of the visitor
  locationId: string; // reference to Location document
  result: VisitResult; // enum value
  timestamp: Date; // visit time
  note?: string; // optional memo
  photoUrl?: string; // optional photo from Storage
  createdAt: Date; // server timestamp
}

// User type - optional user profile
export interface User {
  uid: string;
  displayName?: string;
  email?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

// Firestore collection names
export const COLLECTIONS = {
  LOCATIONS: 'locations',
  VISITS: 'visits',
  USERS: 'users',
} as const;
