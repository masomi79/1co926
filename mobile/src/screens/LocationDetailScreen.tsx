/**
 * Location Detail Screen - Display details and create visits
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { VisitResult } from '../types/firestore';
import { createVisit } from '../services/firestore';
import { getCurrentUser } from '../services/auth';
import { VISIT_RESULTS } from '../constants/config';

type LocationDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LocationDetail'>;
type LocationDetailRouteProp = RouteProp<RootStackParamList, 'LocationDetail'>;

interface Props {
  navigation: LocationDetailNavigationProp;
  route: LocationDetailRouteProp;
}

export default function LocationDetailScreen({ navigation, route }: Props) {
  const { location } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateVisit = async (result: VisitResult) => {
    const user = getCurrentUser();
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a visit');
      return;
    }

    setSubmitting(true);
    try {
      await createVisit({
        userId: user.uid,
        locationId: location.id,
        result,
        timestamp: new Date(),
        note: '',
      });

      Alert.alert(
        'Success',
        'Visit recorded successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create visit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.name}>{location.name}</Text>
          {location.description && (
            <Text style={styles.description}>{location.description}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Latitude:</Text>
            <Text style={styles.value}>{location.lat.toFixed(6)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Longitude:</Text>
            <Text style={styles.value}>{location.lng.toFixed(6)}</Text>
          </View>
          {location.category && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Category:</Text>
              <Text style={styles.value}>{location.category}</Text>
            </View>
          )}
          {location.source && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Source:</Text>
              <Text style={styles.value}>{location.source}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.recordButtonText}>Record Visit</Text>
        </TouchableOpacity>
      </View>

      {/* Visit Result Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Visit Result</Text>

            {VISIT_RESULTS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.resultOption}
                onPress={() => handleCreateVisit(option.value as VisitResult)}
                disabled={submitting}
              >
                <Text style={styles.resultText}>{option.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  recordButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  recordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  resultOption: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
