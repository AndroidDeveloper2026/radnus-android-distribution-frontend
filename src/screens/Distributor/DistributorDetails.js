import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "./DistributorOnboardingStyle";
import Header from "../../components/Header";
import { Store, Phone, MapPin, CheckCircle } from "lucide-react-native";

const DistributorDetails = ({ route, navigation }) => {
  const { distributor } = route.params;

  const approve = () => {
    Alert.alert("Approved", "Distributor approved");
    navigation.goBack();
  };

  const reject = () => {
    Alert.alert("Rejected", "Distributor rejected");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Distributor Details" />

      <View style={styles.detailCard}>
        <View style={styles.row}>
          <View style={styles.iconCircleLarge}>
            <Store size={22} color="#D32F2F" />
          </View>

          <View>
            <Text style={styles.name}>{distributor.name}</Text>
            <Text style={styles.sub}>{distributor.firm}</Text>
          </View>
        </View>

        <Text style={styles.section}>Contact Information</Text>

        <View style={styles.detailRow}>
          <Phone size={14} color="#777" />
          <Text style={styles.detailText}>
            {distributor.mobile}
          </Text>
        </View>

        <Text style={styles.section}>Territory</Text>

        <View style={styles.detailRow}>
          <MapPin size={14} color="#777" />
          <Text style={styles.detailText}>
            {distributor.territory}
          </Text>
        </View>

        <Text style={styles.section}>Verification Checklist</Text>

        <View style={styles.detailRow}>
          <CheckCircle size={14} color="#2E7D32" />
          <Text style={styles.detailText}>Documents verified</Text>
        </View>

        <View style={styles.detailRow}>
          <CheckCircle size={14} color="#2E7D32" />
          <Text style={styles.detailText}>Shop photo verified</Text>
        </View>

        <View style={styles.detailRow}>
          <CheckCircle size={14} color="#2E7D32" />
          <Text style={styles.detailText}>Territory available</Text>
        </View>
      </View>

      {distributor.status === "PENDING" && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={approve}
          >
            <Text style={styles.actionText}>✓ APPROVE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={reject}
          >
            <Text style={styles.actionText}>✕ REJECT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DistributorDetails;
