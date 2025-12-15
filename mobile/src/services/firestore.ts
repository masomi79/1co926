/**
 * Firestore service - handles database operations for locations and visits
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Location, Visit, COLLECTIONS } from '../types/firestore';

/**
 * Locations - Read operations
 */
export const getLocations = async (): Promise<Location[]> => {
  const locationsRef = collection(db, COLLECTIONS.LOCATIONS);
  const snapshot = await getDocs(locationsRef);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Location[];
};

export const getLocationById = async (id: string): Promise<Location | null> => {
  const docRef = doc(db, COLLECTIONS.LOCATIONS, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
  } as Location;
};

/**
 * Visits - CRUD operations
 */
export const createVisit = async (visit: Omit<Visit, 'id' | 'createdAt'>): Promise<string> => {
  const visitsRef = collection(db, COLLECTIONS.VISITS);
  const docRef = await addDoc(visitsRef, {
    ...visit,
    timestamp: Timestamp.fromDate(visit.timestamp),
    createdAt: serverTimestamp(),
  });
  
  return docRef.id;
};

export const getVisitsByLocation = async (locationId: string): Promise<Visit[]> => {
  const visitsRef = collection(db, COLLECTIONS.VISITS);
  const q = query(
    visitsRef,
    where('locationId', '==', locationId),
    orderBy('timestamp', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate() || new Date(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Visit[];
};

export const getVisitsByUser = async (userId: string): Promise<Visit[]> => {
  const visitsRef = collection(db, COLLECTIONS.VISITS);
  const q = query(
    visitsRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate() || new Date(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Visit[];
};

export const updateVisit = async (visitId: string, updates: Partial<Visit>): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.VISITS, visitId);
  await updateDoc(docRef, updates);
};

export const deleteVisit = async (visitId: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.VISITS, visitId);
  await deleteDoc(docRef);
};

/**
 * Admin operations for locations
 */
export const createLocation = async (location: Omit<Location, 'id'>): Promise<string> => {
  const locationsRef = collection(db, COLLECTIONS.LOCATIONS);
  const docRef = await addDoc(locationsRef, {
    ...location,
    createdAt: serverTimestamp(),
  });
  
  return docRef.id;
};

export const updateLocation = async (locationId: string, updates: Partial<Location>): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.LOCATIONS, locationId);
  await updateDoc(docRef, updates);
};

export const deleteLocation = async (locationId: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.LOCATIONS, locationId);
  await deleteDoc(docRef);
};
