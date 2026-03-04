
// import React from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import styles from "./DistributorDashboardStyle";
// import Header from "../../components/Header";
// import {
//   IndianRupee,
//   Package,
//   Users,
//   Wallet,
//   ClipboardList,
//   Plus
// } from "lucide-react-native";

// const DistributorDashboard = ({ navigation }) => {
//   const stats = {
//     todaySales: 42500,
//     stockValue: 152000,
//     pendingCollections: 38000,
//     activeFSE: 6,
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="Distributor Dashboard" showBackArrow={false}/>

//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* WELCOME */}
//         <View style={styles.welcomeBox}>
//           <Text style={styles.welcome}>Welcome, Distributor</Text>
//           <Text style={styles.subWelcome}>Business Overview</Text>
//         </View>

//         {/* STATS GRID */}
//         <View style={styles.grid}>
//           <StatCard
//             icon={<IndianRupee size={18} color="#2E7D32" />}
//             value={`₹${stats.todaySales}`}
//             label="Today Sales"
//           />

//           <StatCard
//             icon={<Package size={18} color="#D32F2F" />}
//             value={`₹${stats.stockValue}`}
//             label="Stock Value"
//           />

//           <StatCard
//             icon={<Wallet size={18} color="#F9A825" />}
//             value={`₹${stats.pendingCollections}`}
//             label="Pending Collections"
//           />

//           <StatCard
//             icon={<Users size={18} color="#1976D2" />}
//             value={stats.activeFSE}
//             label="Active FSE"
//           />
//         </View>

//         {/* QUICK ACTIONS */}
//         <Text style={styles.sectionTitle}>Quick Actions</Text>

//         <QuickAction
//           icon={<Package size={18} color="#D32F2F" />}
//           label="Stock Summary"
//           onPress={() => navigation.navigate("StockVisibility")}
//         />

        
//         <QuickAction
//           icon={<Plus size={18} color="#D32F2F" />}
//           label="FSE Onboading"
//           onPress={() => navigation.navigate("FSEOnboarding")}
//         />

//         <QuickAction
//           icon={<Users size={18} color="#1976D2" />}
//           label="Manage FSE"
//           onPress={() => navigation.navigate("FSEManagement")}
//         />

//         <QuickAction
//           icon={<ClipboardList size={18} color="#2E7D32" />}
//           label="Retailer Orders"
//           onPress={() => navigation.navigate("OrderSuccess")}
//         />

//         <QuickAction
//           icon={<Wallet size={18} color="#F9A825" />}
//           label="Collections"
//           onPress={() => navigation.navigate("Collections")}
//         />
//       </ScrollView>
//     </View>
//   );
// };

// /* COMPONENTS */

// const StatCard = ({ icon, value, label }) => (
//   <View style={styles.statCard}>
//     <View style={styles.statIcon}>{icon}</View>
//     <Text style={styles.statValue}>{value}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//   </View>
// );

// const QuickAction = ({ icon, label, onPress }) => (
//   <TouchableOpacity style={styles.actionRow} onPress={onPress}>
//     <View style={styles.actionLeft}>
//       <View style={styles.actionIcon}>{icon}</View>
//       <Text style={styles.actionText}>{label}</Text>
//     </View>
//     <Text style={styles.arrow}>›</Text>
//   </TouchableOpacity>
// );

// export default DistributorDashboard;

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "./DistributorDashboardStyle";
import Header from "../../components/Header";
import Icons from "../../components/Icon";

const DistributorDashboard = ({ navigation }) => {

  const stats = {
    todaySales: 0,
    stockValue: 0,
    pendingCollections: 0,
    activeFSE: 0,
  };

  return (
    <View style={styles.container}>
      <Header title="Distributor Dashboard" showBackArrow={false} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* WELCOME */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcome}>Welcome, Distributor</Text>
          <Text style={styles.subWelcome}>Business Overview</Text>
        </View>


        {/* STATS GRID */}

        <View style={styles.grid}>

          <StatCard
            icon={
              <Icons
                name={"IndianRupee"}
                size={20}
                color="#2E7D32"
                circleSize={50}
                withCircle={true}
                backgroundColor="#d9f5df"
              />
            }
            value={`₹${stats.todaySales}`}
            label="Today Sales"
          />

          <StatCard
            icon={
              <Icons
                name={"Package"}
                size={20}
                color="#D32F2F"
                circleSize={50}
                withCircle={true}
                backgroundColor="#ffd6d6"
              />
            }
            value={`₹${stats.stockValue}`}
            label="Stock Value"
          />

          <StatCard
            icon={
              <Icons
                name={"Wallet"}
                size={20}
                color="#F9A825"
                circleSize={50}
                withCircle={true}
                backgroundColor="#fff3cd"
              />
            }
            value={`₹${stats.pendingCollections}`}
            label="Pending Collections"
          />

          <StatCard
            icon={
              <Icons
                name={"Users"}
                size={20}
                color="#1976D2"
                circleSize={50}
                withCircle={true}
                backgroundColor="#d6e8ff"
              />
            }
            value={stats.activeFSE}
            label="Active FSE"
          />

        </View>


        {/* QUICK ACTIONS */}

        <Text style={styles.sectionTitle}>Quick Actions</Text>


        <QuickAction
          icon={
            <Icons
              name={"Package"}
              size={20}
              color="#D32F2F"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#ffd6d6"
            />
          }
          label="Stock Summary"
          onPress={() => navigation.navigate("StockVisibility")}
        />


        <QuickAction
          icon={
            <Icons
              name={"Plus"}
              size={20}
              color="#2E7D32"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#d9f5df"
            />
          }
          label="FSE Onboading"
          onPress={() => navigation.navigate("FSEOnboarding")}
        />


        <QuickAction
          icon={
            <Icons
              name={"Users"}
              size={20}
              color="#1976D2"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#d6e8ff"
            />
          }
          label="Manage FSE"
          onPress={() => navigation.navigate("FSEManagement")}
        />


        <QuickAction
          icon={
            <Icons
              name={"ClipboardList"}
              size={20}
              color="#6A1B9A"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#f1e0ff"
            />
          }
          label="Retailer Orders"
          onPress={() => navigation.navigate("OrderSuccess")}
        />


        <QuickAction
          icon={
            <Icons
              name={"Wallet"}
              size={20}
              color="#F9A825"
              circleSize={40}
              withCircle={true}
              backgroundColor="#fff3cd"
            />
          }
          label="Collections"
          onPress={() => navigation.navigate("Collections")}
        />

      </ScrollView>
    </View>
  );
};


/* COMPONENTS */

const StatCard = ({ icon, value, label }) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>{icon}</View>
    <Text style={styles.kpiValue}>{value}</Text>
    <Text style={styles.kpiLabel}>{label}</Text>
  </View>
);


const QuickAction = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionRow} onPress={onPress}>
    <View style={styles.actionLeft}>
      <View style={styles.actionIcon}>{icon}</View>
      <Text style={styles.actionText}>{label}</Text>
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

export default DistributorDashboard;
