import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import Header from "../../components/Header";
import styles from './DistributorDetailsStyle';
import {
  Store, Phone, MapPin, CheckCircle,
  BadgeCheck, Clock, Building2,
} from "lucide-react-native";

const DistributorDetails = ({ route, navigation }) => {
  const { distributor } = route.params || {};

  const approve = () => {
    Alert.alert("Approved", "Distributor approved");
    navigation.goBack();
  };

  const reject = () => {
    Alert.alert("Rejected", "Distributor rejected");
    navigation.goBack();
  };

  // ── Safety guard ─────────────────────────────────────
  if (!distributor) {
    return (
      <View style={styles.container}>
        <Header title="Distributor Details" />
        <View style={styles.centerBox}>
          <Store size={48} color="#ddd" strokeWidth={1.5} />
          <Text style={styles.emptyText}>No distributor data found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Distributor Details" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.card}>

          {/* ── Profile image + name + status ── */}
          <View style={styles.profileRow}>
            <Image
              source={{
                uri:
                  distributor?.images?.profile ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.profileImage}
            />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.name}>{distributor.name || "—"}</Text>

              <View
                style={[
                  styles.statusBadge,
                  distributor.status === "APPROVED"
                    ? styles.approvedBadge
                    : styles.pendingBadge,
                ]}
              >
                {distributor.status === "APPROVED" ? (
                  <BadgeCheck size={12} color="#16a34a" strokeWidth={2.5} />
                ) : (
                  <Clock size={12} color="#d97706" strokeWidth={2.5} />
                )}
                <Text
                  style={[
                    styles.statusText,
                    distributor.status === "APPROVED"
                      ? styles.approvedText
                      : styles.pendingText,
                  ]}
                >
                  {"  "}{distributor.status || "PENDING"}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Business Information ── */}
          <Text style={styles.section}>Business Information</Text>

          {distributor.businessName ? (
            <View style={styles.detailRow}>
              <Building2 size={14} color="#777" strokeWidth={2} />
              <Text style={styles.detailText}>{distributor.businessName}</Text>
            </View>
          ) : null}

          {distributor.gst ? (
            <View style={styles.detailRow}>
              <BadgeCheck size={14} color="#777" strokeWidth={2} />
              <Text style={styles.detailText}>GST: {distributor.gst}</Text>
            </View>
          ) : null}

          {/* ── Contact Information ── */}
          <Text style={styles.section}>Contact Information</Text>

          <View style={styles.detailRow}>
            <Phone size={14} color="#777" strokeWidth={2} />
            <Text style={styles.detailText}>{distributor.mobile || "—"}</Text>
          </View>

          {/* ── Address ── */}
          {distributor.address ? (
            <>
              <Text style={styles.section}>Address</Text>
              <View style={styles.detailRow}>
                <MapPin size={14} color="#777" strokeWidth={2} />
                <Text style={styles.detailText}>{distributor.address}</Text>
              </View>
            </>
          ) : null}

          {/* ── Verification Checklist ── */}
          <Text style={styles.section}>Verification Checklist</Text>

          <View style={styles.detailRow}>
            <CheckCircle size={14} color="#2E7D32" strokeWidth={2} />
            <Text style={styles.detailText}>Documents verified</Text>
          </View>
          <View style={styles.detailRow}>
            <CheckCircle size={14} color="#2E7D32" strokeWidth={2} />
            <Text style={styles.detailText}>Shop photo verified</Text>
          </View>
          <View style={styles.detailRow}>
            <CheckCircle size={14} color="#2E7D32" strokeWidth={2} />
            <Text style={styles.detailText}>Territory available</Text>
          </View>

        </View>
      </ScrollView>

      {/* ── Approve / Reject buttons ── */}
      {distributor.status === "PENDING" && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.approveBtn} onPress={approve}>
            <CheckCircle size={16} color="#fff" strokeWidth={2.5} />
            <Text style={styles.actionText}>  APPROVE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rejectBtn} onPress={reject}>
            <Text style={styles.actionText}>✕  REJECT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};



export default DistributorDetails;