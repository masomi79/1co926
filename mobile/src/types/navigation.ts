/**
 * Navigation types for the app
 */
import { Location } from '../types/firestore';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  LocationDetail: { location: Location };
  CreateVisit: { locationId: string; locationName: string };
};
