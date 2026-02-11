import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import styles from "./OrderSucessStyle";

const OrderSuccessScreen = ({ route, navigation }) => {

  const { invoiceNumber, grandTotal, paymentMode } =
    route.params || {};

  return (
    <View style={styles.container}>

      {/* SUCCESS ANIMATION */}
      <LottieView
        source={require("../../assets/json/OrderSuccess.json")}
        autoPlay
        loop={false}
        style={styles.animation}
      />

      {/* TITLE */}
      <Text style={styles.title}>Order Successful</Text>

      {/* DETAILS CARD */}
      <View style={styles.card}>

        <Text style={styles.label}>Invoice Number</Text>
        <Text style={styles.value}>{invoiceNumber}</Text>

        <Text style={styles.label}>Payment Mode</Text>
        <Text style={styles.value}>
          {paymentMode?.toUpperCase()}
        </Text>

        <Text style={styles.label}>Amount Paid</Text>
        <Text style={styles.amount}>
          ₹{grandTotal}
        </Text>

      </View>

      {/* BUTTONS */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.primaryText}>
          Back to Dashboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate("ProductList")}
      >
        <Text style={styles.secondaryText}>
          Book Another Order
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default OrderSuccessScreen;
