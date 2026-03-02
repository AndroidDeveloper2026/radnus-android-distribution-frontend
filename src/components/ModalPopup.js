import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const MessagePopup = ({
  visible,
  type = 'success', // success | error | warning
  title,
  description,
  buttonText = 'OK',
  onPress,
  onClose,
  secondaryText,
  onSecondaryPress,
}) => {
  // 🎨 Colors
  const colors = {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
  };

  const buttonColor = colors[type];

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* 🏷 TITLE */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* 📝 DESCRIPTION */}
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}

          {/* 🔘 BUTTONS */}
          <View style={styles.buttonRow}>
            {secondaryText && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onSecondaryPress || onClose}
              >
                <Text style={styles.secondaryText}>
                  {secondaryText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: buttonColor }]}
              onPress={onPress || onClose}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default MessagePopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },

  button: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },

  secondaryButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  secondaryText: {
    color: '#333',
    fontWeight: '600',
  },
});