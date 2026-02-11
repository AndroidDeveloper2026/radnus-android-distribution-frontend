import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import styles from "./RetailerStyle";

const RetailerApprovalModal = ({
  visible,
  retailer,
  onApprove,
  onReject,
  onClose,
}) => {
  if (!retailer) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            Review Retailer
          </Text>

          <Text style={styles.modalText}>
            {retailer.name}
          </Text>
          <Text style={styles.modalSub}>
            {retailer.area}
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={onReject}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.approveBtn}
              onPress={onApprove}
            >
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RetailerApprovalModal;
