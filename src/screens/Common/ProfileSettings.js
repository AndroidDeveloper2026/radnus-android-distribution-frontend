import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "./ProfileSettingsStyle";
import Header from "../../components/Header";
import { useDispatch } from "react-redux";
// import {adminLogout} from '../../services/features/auth/adminAuthSlice'
import { globalLogout } from '../../store/actions/globalLogout';
import {
  User,
  Phone,
  MapPin,
  FileText,
  Building2,
  CreditCard,
  Bell,
  ShieldCheck,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react-native";


const ProfileSettings = ({ navigation }) => {
const dispatch = useDispatch();

const handleLogout = async () => {
  await dispatch(globalLogout());
};

  // const handleLogout = async () => {
  //   await dispatch(adminLogout());
  //   console.log(navigation.getState());
  //   navigation.reset({
  //     index: 0,
  //     routes: [{ name: "AdminLogin" }],
  //   });
  // };

  return (
    <View style={styles.container}>
      <Header title="Profile & Settings" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* BUSINESS PROFILE */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={28} color="#D32F2F" />
          </View>

          <Text style={styles.name}>Radnus Distributors</Text>
          <Text style={styles.subText}>GST: 29ABCDE1234F1Z9</Text>
          <Text style={styles.subText}>Territory: Bangalore South</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* BUSINESS DETAILS */}
        <Section title="Business Details">
          <SettingItem
            icon={<Building2 size={18} color="#555" />}
            label="Business Information"
            desc="Shop name, owner, GST"
            onPress={() => navigation.navigate("BusinessInfo")}
          />

          <SettingItem
            icon={<MapPin size={18} color="#555" />}
            label="Business Address"
            desc="Pickup & billing address"
            onPress={() => navigation.navigate("BusinessAddress")}
          />
        </Section>

        {/* KYC & DOCUMENTS */}
        <Section title="KYC & Documents">
          <SettingItem
            icon={<FileText size={18} color="#555" />}
            label="KYC Documents"
            desc="PAN, GST, Shop photo"
            status="VERIFIED"
            onPress={() => navigation.navigate("KYC")}
          />
        </Section>

        {/* BANK & PAYOUT */}
        <Section title="Bank & Payments">
          <SettingItem
            icon={<CreditCard size={18} color="#555" />}
            label="Bank Account"
            desc="Payout & settlements"
            onPress={() => navigation.navigate("BankDetails")}
          />
        </Section>

        {/* APP SETTINGS */}
        <Section title="App Preferences">
          <SettingItem
            icon={<Bell size={18} color="#555" />}
            label="Notifications"
            desc="Orders, payments, stock alerts"
            onPress={() => navigation.navigate("Notifications")}
          />

          <SettingItem
            icon={<ShieldCheck size={18} color="#555" />}
            label="Security Settings"
            desc="Change PIN, sessions"
            onPress={() => navigation.navigate("Security")}
          />
        </Section>

        {/* SUPPORT */}
        <Section title="Support">
          <SettingItem
            icon={<HelpCircle size={18} color="#555" />}
            label="Help & Support"
            desc="FAQs, contact admin"
            onPress={() => navigation.navigate("Support")}
          />
        </Section>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={18} color="#FFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

/* REUSABLE COMPONENTS */

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const SettingItem = ({ icon, label, desc, status, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.itemLeft}>
      <View style={styles.iconCircle}>{icon}</View>
      <View>
        <Text style={styles.itemText}>{label}</Text>
        {desc && <Text style={styles.desc}>{desc}</Text>}
      </View>
    </View>

    <View style={styles.itemRight}>
      {status && (
        <Text
          style={[
            styles.status,
            status === "VERIFIED" ? styles.verified : styles.pending,
          ]}
        >
          {status}
        </Text>
      )}
      <ChevronRight size={18} color="#999" />
    </View>
  </TouchableOpacity>
);

export default ProfileSettings;
