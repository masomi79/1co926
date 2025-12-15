/**
 * Firebase configuration constants
 * 
 * IMPORTANT: Replace these with your actual Firebase project credentials
 * For security, consider using environment variables in production
 */

export const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "my-test-project-85b1b.firebaseapp.com",
  projectId: "my-test-project-85b1b",
  storageBucket: "my-test-project-85b1b.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Example visit result options for UI
export const VISIT_RESULTS = [
  { value: 'Wal_Aisan', label: 'Wal Aisan' },
  { value: 'Upla_Apu', label: 'Upla Apu' },
  { value: 'Kli_Wabia', label: 'Kli Wabia' },
  { value: 'Upla_Iwras', label: 'Upla Iwras' },
] as const;

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 35.6895,
  DEFAULT_LONGITUDE: 139.6917,
  DEFAULT_ZOOM: 12,
  DEFAULT_DELTA: 0.0922, // for region delta
};
