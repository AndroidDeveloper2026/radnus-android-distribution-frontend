import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import styles from "./ProfileSettingsStyle";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../services/features/profile/profileSlice"; 
import { globalLogout } from "../../store/actions/globalLogout";
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
  Store,
  Briefcase,
  Hash,
  Mail,
  Calendar,
  Navigation,
} from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";

// ─────────────────────────────────────────────
// Role-based profile header config
// ─────────────────────────────────────────────
const getProfileHeader = (role, profileData, authUser) => {
  switch (role) {
    case "Distributor":
      return {
        name: profileData?.businessName || authUser?.name || "—",
        lines: [
          profileData?.gst ? `GST: ${profileData.gst}` : null,
          profileData?.msme ? `MSME: ${profileData.msme}` : null,
          authUser?.district && authUser?.state
            ? `${authUser.district}, ${authUser.state}`
            : null,
        ].filter(Boolean),
        photo: null,
        status: profileData?.status,
      };

    case "Retailer":
      return {
        name: profileData?.shopName || authUser?.name || "—",
        lines: [
          profileData?.ownerName ? `Owner: ${profileData.ownerName}` : null,
          profileData?.mobile ? `📞 ${profileData.mobile}` : null,
          profileData?.gps ? `📍 ${profileData.gps}` : null,
        ].filter(Boolean),
        photo: profileData?.shopPhoto || null,
        status: profileData?.status,
      };

    case "Executive":
      return {
        name: profileData?.name || authUser?.name || "—",
        lines: [
          profileData?.email || authUser?.email
            ? `${profileData?.email || authUser?.email}`
            : null,
          profileData?.phone ? `📞 ${profileData.phone}` : null,
          profileData?.dob ? `DOB: ${profileData.dob}` : null,
        ].filter(Boolean),
        photo: profileData?.photo || null,
        status: profileData?.status,
      };

    case "Radnus":
      return {
        name: profileData?.name || authUser?.name || "—",
        lines: [
          profileData?.email ? profileData.email : null,
          profileData?.phone ? `📞 ${profileData.phone}` : null,
          profileData?.address ? profileData.address : null,
        ].filter(Boolean),
        photo: profileData?.photo || null,
        status: profileData?.status,
      }
    default:
      return {
        name: authUser?.name || "—",
        lines: [
          authUser?.email || null,
          authUser?.mobile ? `📞 ${authUser.mobile}` : null,
          authUser?.district && authUser?.state
            ? `${authUser.district}, ${authUser.state}`
            : null,
        ].filter(Boolean),
        photo: null,
        status: null,
      };
  }
};

// ─────────────────────────────────────────────
// Role-based settings sections config
// ─────────────────────────────────────────────
const getSections = (role, navigation) => {
  const common = [
    {
      title: "App Preferences",
      items: [
        {
          icon: <Bell size={18} color="#555" />,
          label: "Notifications",
          desc: "Orders, payments, stock alerts",
          onPress: () => navigation.navigate("Notifications"),
        },
        {
          icon: <ShieldCheck size={18} color="#555" />,
          label: "Security Settings",
          desc: "Change PIN, sessions",
          onPress: () => navigation.navigate("Security"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: <HelpCircle size={18} color="#555" />,
          label: "Help & Support",
          desc: "FAQs, contact admin",
          onPress: () => navigation.navigate("Support"),
        },
      ],
    },
  ];

  const byRole = {
    Distributor: [
      {
        title: "Business Details",
        items: [
          {
            icon: <Building2 size={18} color="#555" />,
            label: "Business Information",
            desc: "Shop name, owner, GST, MSME",
            onPress: () => navigation.navigate("BusinessInfo"),
          },
          {
            icon: <MapPin size={18} color="#555" />,
            label: "Business Address",
            desc: "Pickup & billing address",
            onPress: () => navigation.navigate("BusinessAddress"),
          },
        ],
      },
      {
        title: "KYC & Documents",
        items: [
          {
            icon: <FileText size={18} color="#555" />,
            label: "KYC Documents",
            desc: "PAN, GST, Shop photo",
            status: "VERIFIED",
            onPress: () => navigation.navigate("KYC"),
          },
        ],
      },
      {
        title: "Bank & Payments",
        items: [
          {
            icon: <CreditCard size={18} color="#555" />,
            label: "Bank Account",
            desc: "Payout & settlements",
            onPress: () => navigation.navigate("BankDetails"),
          },
        ],
      },
    ],

    Retailer: [
      {
        title: "Shop Details",
        items: [
          {
            icon: <Store size={18} color="#555" />,
            label: "Shop Information",
            desc: "Shop name, owner, mobile",
            onPress: () => navigation.navigate("ShopInfo"),
          },
          {
            icon: <Navigation size={18} color="#555" />,
            label: "Shop Location",
            desc: "GPS & address",
            onPress: () => navigation.navigate("ShopLocation"),
          },
        ],
      },
      {
        title: "KYC & Documents",
        items: [
          {
            icon: <FileText size={18} color="#555" />,
            label: "KYC Documents",
            desc: "Shop photo, ID proof",
            status: "VERIFIED",
            onPress: () => navigation.navigate("KYC"),
          },
        ],
      },
    ],

    Executive: [
      {
        title: "Personal Details",
        items: [
          {
            icon: <User size={18} color="#555" />,
            label: "Personal Information",
            desc: "Name, DOB, contact",
            onPress: () => navigation.navigate("PersonalInfo"),
          },
          {
            icon: <MapPin size={18} color="#555" />,
            label: "Address",
            desc: "Current address",
            onPress: () => navigation.navigate("Address"),
          },
        ],
      },
      {
        title: "Documents",
        items: [
          {
            icon: <FileText size={18} color="#555" />,
            label: "ID Documents",
            desc: "Photo ID, proof",
            status: "VERIFIED",
            onPress: () => navigation.navigate("KYC"),
          },
        ],
      },
    ],

    Agent: [
      {
        title: "Personal Details",
        items: [
          {
            icon: <User size={18} color="#555" />,
            label: "Personal Information",
            desc: "Name, DOB, email, contact",
            onPress: () => navigation.navigate("PersonalInfo"),
          },
          {
            icon: <MapPin size={18} color="#555" />,
            label: "Addresses",
            desc: "Primary & alternate address",
            onPress: () => navigation.navigate("Address"),
          },
        ],
      },
      {
        title: "Documents",
        items: [
          {
            icon: <FileText size={18} color="#555" />,
            label: "ID Documents",
            desc: "Photo ID, proof",
            status: "VERIFIED",
            onPress: () => navigation.navigate("KYC"),
          },
        ],
      },
    ],
  };

  return [...(byRole[role] || []), ...common];
};

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
const ProfileSettings = ({ navigation }) => {
  const dispatch = useDispatch();

  // Pull from your Redux store — adjust slice paths as needed
  const authUser = useSelector((state) => state.auth?.user);
  const profileData = useSelector((state) => state.profile?.data);
  const role = authUser?.role || "Distributor"; // fallback for safety

  console.log("--- profile image data ---", profileData?.photo);
    // Refresh profile every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch])
  );

  const { name, lines, photo, status } = getProfileHeader(
    role,
    profileData,
    authUser
  );

  const sections = getSections(role, navigation);

  const handleLogout = async () => {
    await dispatch(globalLogout());
  };

  return (
    <View style={styles.container}>
      <Header title="Profile & Settings" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── PROFILE CARD ── */}
        <View style={styles.profileCard}>

          {/* Avatar / Shop Photo */}
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              {role === "Retailer" ? (
                <Store size={28} color="#D32F2F" />
              ) : role === "Distributor" ? (
                <Building2 size={28} color="#D32F2F" />
              ) : (
                <User size={28} color="#D32F2F" />
              )}
            </View>
          )}

          {/* Role Badge */}
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{role}</Text>
          </View>

          <Text style={styles.name}>{name}</Text>

          {lines.map((line, i) => (
            <Text key={i} style={styles.subText}>{line}</Text>
          ))}

          {/* Onboarding Status */}
          {status && (
            <View
              style={[
                styles.statusBadge,
                status === "APPROVED" ? styles.statusApproved : styles.statusPending,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  status === "APPROVED"
                    ? styles.statusApprovedText
                    : styles.statusPendingText,
                ]}
              >
                {status}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── DYNAMIC SECTIONS ── */}
        {sections.map((section, sIdx) => (
          <Section key={sIdx} title={section.title}>
            {section.items.map((item, iIdx) => (
              <SettingItem
                key={iIdx}
                icon={item.icon}
                label={item.label}
                desc={item.desc}
                status={item.status}
                onPress={item.onPress}
              />
            ))}
          </Section>
        ))}

        {/* ── LOGOUT ── */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={18} color="#FFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};


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