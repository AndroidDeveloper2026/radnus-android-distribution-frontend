// LocationDisclosureModal.js
//
// Google Play "Prominent Disclosure and Consent" requirement:
// Before an app requests ACCESS_BACKGROUND_LOCATION (or fine/coarse location
// that will later be used in the background), it must show a STANDALONE,
// clearly worded, in-app disclosure that:
//   1. Is separate from the general Terms & Conditions / Privacy Policy
//   2. Explains WHAT is collected (precise location)
//   3. Explains that it is collected IN THE BACKGROUND (even when the app
//      is closed or not in use)
//   4. Explains WHY (attendance verification, route/visit tracking)
//   5. Requires an explicit affirmative user action (Allow / Don't Allow)
//      BEFORE the OS runtime permission dialog appears
//
// This screen is also what Google's reviewer expects to see in the
// declaration video, right before the device permission dialog.

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MapPin, ShieldCheck } from 'lucide-react-native';

const LocationDisclosureModal = ({ visible, onAllow, onDeny }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDeny}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <MapPin size={32} color="#D32F2F" />
          </View>

          <Text style={styles.title}>Radnus Connect collects location data</Text>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.text}>
              Radnus Connect collects precise location data{' '}
              <Text style={styles.bold}>
                even when the app is closed or not in use
              </Text>{' '}
              while you are checked in for your workday.
            </Text>

            <Text style={styles.text}>
              This background location is used to:
            </Text>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Verify your retailer visits during your route
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Record your travelled distance for attendance and reporting
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Share your live position with your manager while you are on duty
              </Text>
            </View>

            <Text style={styles.text}>
              Tracking automatically stops when you end your day. Location
              data is never sold and is never shared for advertising.
            </Text>

            <View style={styles.policyRow}>
              <ShieldCheck size={16} color="#4CAF50" />
              <Text style={styles.policyText}>
                Read the full Privacy Policy for details on how this data is
                stored and who can access it.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.allowButton} onPress={onAllow}>
            <Text style={styles.allowText}>Allow location access</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.denyButton} onPress={onDeny}>
            <Text style={styles.denyText}>Don't allow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LocationDisclosureModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
  },
  iconWrap: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },
  bold: {
    fontWeight: '700',
    color: '#222',
  },
  bulletRow: {
    flexDirection: 'row',
    paddingLeft: 4,
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    color: '#444',
    marginRight: 8,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F7F3',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    gap: 8,
  },
  policyText: {
    flex: 1,
    fontSize: 12.5,
    color: '#3a5a3a',
    lineHeight: 18,
  },
  allowButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  allowText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  denyButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  denyText: {
    color: '#777',
    fontWeight: '600',
    fontSize: 14,
  },
});
