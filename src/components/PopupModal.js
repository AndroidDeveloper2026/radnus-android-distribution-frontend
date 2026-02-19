import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

const PopupModal = ({
  visible,
  gifSource,
  title,
  description,
  buttonText = 'OK',
  onPress,
  onClose,
  secondaryText,
  onSecondaryPress,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* GIF / IMAGE */}
          {gifSource && (
            <Image source={gifSource} style={styles.gif} resizeMode="contain" />
          )}

          {/* TITLE */}
          <Text style={styles.title}>{title}</Text>

          {/* DESCRIPTION */}
          <Text style={styles.description}>{description}</Text>

          <View style={styles.buttonRow}>
            {secondaryText && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onSecondaryPress || onClose}
              >
                <Text style={styles.secondaryText}>{secondaryText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },

  gif: {
    width: 200,
    height: 160,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    marginTop: 10,
  },

  description: {
    fontSize: 15,
    color: '#757575',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },

  secondaryButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  secondaryText: {
    color: '#333',
    fontWeight: '600',
  },
});

export default PopupModal;
